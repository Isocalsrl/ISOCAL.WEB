import { randomUUID } from "node:crypto";

import { db } from "../../../database/db.js";
import { withTransaction } from "../../../database/transaction.js";
import type { QuoteEmailDelivery } from "../quoteDelivery.types.js";
import { insertQuoteEvent } from "./quotes.events.repository.js";

interface DeliveryRow {
    id: string | number;
    quote_id: string | number;
    document_file_id: string | number;
    attempt_type: "send" | "resend";
    recipient_email: string;
    provider: string;
    provider_message_id: string | null;
    status: "pending" | "sent" | "failed";
    idempotency_key: string;
    error_code: string | null;
    error_message: string | null;
    requested_by: number | null;
    created_at: Date;
    sent_at: Date | null;
}

const COLUMNS = `
    id, quote_id, document_file_id, attempt_type, recipient_email, provider,
    provider_message_id, status, idempotency_key, error_code, error_message,
    requested_by, created_at, sent_at
`;

function toDelivery(row: DeliveryRow): QuoteEmailDelivery {
    return {
        id: Number(row.id),
        quoteId: Number(row.quote_id),
        documentFileId: Number(row.document_file_id),
        attemptType: row.attempt_type,
        recipientEmail: row.recipient_email,
        provider: row.provider,
        providerMessageId: row.provider_message_id,
        status: row.status,
        idempotencyKey: row.idempotency_key,
        errorCode: row.error_code,
        errorMessage: row.error_message,
        requestedBy: row.requested_by,
        createdAt: row.created_at,
        sentAt: row.sent_at,
    };
}

export interface CreateDeliveryAttemptInput {
    quoteId: number;
    documentFileId: number;
    recipientEmail: string;
    provider: string;
    requestedBy: number;
}

export async function getOrCreateInitialDeliveryAttempt(
    input: CreateDeliveryAttemptInput,
): Promise<QuoteEmailDelivery> {
    const key = `quote-send/${input.quoteId}/document/${input.documentFileId}`;
    const inserted = await db.query<DeliveryRow>(
        `INSERT INTO quote_email_deliveries (
            quote_id, document_file_id, attempt_type, recipient_email, provider,
            status, idempotency_key, requested_by
         )
         VALUES ($1, $2, 'send', $3, $4, 'pending', $5, $6)
         ON CONFLICT (idempotency_key) DO NOTHING
         RETURNING ${COLUMNS}`,
        [
            input.quoteId,
            input.documentFileId,
            input.recipientEmail,
            input.provider,
            key,
            input.requestedBy,
        ],
    );

    if (inserted.rows[0]) {
        return toDelivery(inserted.rows[0]);
    }

    const existing = await db.query<DeliveryRow>(
        `UPDATE quote_email_deliveries
         SET status = CASE WHEN status = 'sent' THEN 'sent' ELSE 'pending' END,
             error_code = NULL,
             error_message = NULL
         WHERE document_file_id = $1 AND attempt_type = 'send'
         RETURNING ${COLUMNS}`,
        [input.documentFileId],
    );

    if (!existing.rows[0]) {
        throw new Error("No se pudo recuperar el intento inicial de envío.");
    }

    return toDelivery(existing.rows[0]);
}

export async function createResendDeliveryAttempt(
    input: CreateDeliveryAttemptInput,
): Promise<QuoteEmailDelivery> {
    const result = await db.query<DeliveryRow>(
        `INSERT INTO quote_email_deliveries (
            quote_id, document_file_id, attempt_type, recipient_email, provider,
            status, idempotency_key, requested_by
         )
         VALUES ($1, $2, 'resend', $3, $4, 'pending', $5, $6)
         RETURNING ${COLUMNS}`,
        [
            input.quoteId,
            input.documentFileId,
            input.recipientEmail,
            input.provider,
            `quote-resend/${input.quoteId}/${randomUUID()}`,
            input.requestedBy,
        ],
    );

    return toDelivery(result.rows[0]);
}

export async function markInitialDeliverySent(
    deliveryId: number,
    quoteId: number,
    actorAdminId: number,
    providerMessageId: string,
): Promise<boolean> {
    return withTransaction(async (client) => {
        const quote = await client.query<{ status: "ready_to_send" | "sent" }>(
            "SELECT status FROM quotes WHERE id = $1 FOR UPDATE",
            [quoteId],
        );
        const currentStatus = quote.rows[0]?.status;

        if (!currentStatus || !["ready_to_send", "sent"].includes(currentStatus)) {
            return false;
        }

        const delivery = await client.query(
            `UPDATE quote_email_deliveries
             SET status = 'sent',
                 provider_message_id = $2,
                 error_code = NULL,
                 error_message = NULL,
                 sent_at = COALESCE(sent_at, CURRENT_TIMESTAMP)
             WHERE id = $1 AND quote_id = $3`,
            [deliveryId, providerMessageId, quoteId],
        );

        if (delivery.rowCount !== 1) {
            return false;
        }

        if (currentStatus === "ready_to_send") {
            await client.query(
                `UPDATE quotes
                 SET status = 'sent',
                     sent_at = COALESCE(sent_at, CURRENT_TIMESTAMP),
                     updated_at = CURRENT_TIMESTAMP
                 WHERE id = $1`,
                [quoteId],
            );

            await insertQuoteEvent(client, {
                quoteId,
                actorAdminId,
                eventType: "email_sent",
                fromStatus: "ready_to_send",
                toStatus: "sent",
                note: `Correo enviado. Provider message ID: ${providerMessageId}`,
            });
        }

        return true;
    });
}

export async function markResendDeliverySent(
    deliveryId: number,
    quoteId: number,
    actorAdminId: number,
    providerMessageId: string,
): Promise<boolean> {
    return withTransaction(async (client) => {
        const quote = await client.query<{ status: string }>(
            "SELECT status FROM quotes WHERE id = $1 FOR UPDATE",
            [quoteId],
        );

        if (quote.rows[0]?.status !== "sent") {
            return false;
        }

        const delivery = await client.query(
            `UPDATE quote_email_deliveries
             SET status = 'sent',
                 provider_message_id = $2,
                 error_code = NULL,
                 error_message = NULL,
                 sent_at = CURRENT_TIMESTAMP
             WHERE id = $1 AND quote_id = $3`,
            [deliveryId, providerMessageId, quoteId],
        );

        if (delivery.rowCount !== 1) {
            return false;
        }

        await insertQuoteEvent(client, {
            quoteId,
            actorAdminId,
            eventType: "email_resent",
            fromStatus: "sent",
            toStatus: "sent",
            note: `Cotización reenviada. Provider message ID: ${providerMessageId}`,
        });

        return true;
    });
}

export async function markDeliveryFailed(
    deliveryId: number,
    quoteId: number,
    actorAdminId: number,
    errorCode: string,
    errorMessage: string,
): Promise<void> {
    await withTransaction(async (client) => {
        const result = await client.query(
            `UPDATE quote_email_deliveries
             SET status = 'failed', error_code = $2, error_message = $3
             WHERE id = $1 AND quote_id = $4 AND status <> 'sent'`,
            [
                deliveryId,
                errorCode.slice(0, 120),
                errorMessage.slice(0, 1000),
                quoteId,
            ],
        );

        if (result.rowCount !== 1) {
            return;
        }

        const quote = await client.query<{ status: "ready_to_send" | "sent" }>(
            "SELECT status FROM quotes WHERE id = $1",
            [quoteId],
        );
        const status = quote.rows[0]?.status ?? "ready_to_send";

        await insertQuoteEvent(client, {
            quoteId,
            actorAdminId,
            eventType: "email_failed",
            fromStatus: status,
            toStatus: status,
            note: `Falló el envío: ${errorMessage.slice(0, 850)}`,
        });
    });
}
