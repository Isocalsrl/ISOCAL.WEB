import { db } from "../../database/db.js";
import { withTransaction } from "../../database/transaction.js";
import { toQuoteDetail, toQuoteItem, type QuoteItemRow, type QuoteRow } from "./quotes.mapper.js";
import type { CreateStoredQuoteInput, QuoteDetail } from "./quotes.types.js";

export async function createQuote(input: CreateStoredQuoteInput): Promise<number> {
    return withTransaction(async (client) => {
        const quote = await client.query<{ id: string | number }>(
            `
                INSERT INTO quotes (
                    reference, customer_name, customer_email, customer_phone,
                    company_name, ruc, job_title, location, customer_notes
                )
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                ON CONFLICT (reference) DO UPDATE
                SET reference = EXCLUDED.reference
                RETURNING id
            `,
            [
                input.reference,
                input.customer.fullName,
                input.customer.email,
                input.customer.phone,
                input.customer.companyName ?? null,
                input.customer.ruc ?? null,
                input.customer.jobTitle ?? null,
                input.customer.location ?? null,
                input.customer.notes ?? null,
            ],
        );
        const quoteId = Number(quote.rows[0].id);

        for (const item of input.items) {
            await client.query(
                `
                    INSERT INTO quote_items (
                        quote_id, product_id, product_name, quantity, customer_notes
                    )
                    VALUES ($1,$2,$3,$4,$5)
                    ON CONFLICT (quote_id, product_id) DO NOTHING
                `,
                [quoteId, item.productId, item.productName, item.quantity, item.notes ?? null],
            );
        }
        return quoteId;
    });
}

export async function findQuoteById(id: number): Promise<QuoteDetail | null> {
    const quote = await db.query<QuoteRow>(
        `
            SELECT
                id, reference, customer_name, customer_email, customer_phone,
                company_name, ruc, job_title, location, customer_notes,
                status, created_at, updated_at, sent_at
            FROM quotes
            WHERE id = $1
            LIMIT 1
        `,
        [id],
    );
    if (!quote.rows[0]) return null;

    const items = await db.query<QuoteItemRow>(
        `
            SELECT
                qi.id,
                qi.product_id,
                qi.product_name,
                p.description AS product_description,
                qi.quantity,
                qi.customer_notes,
                (
                    SELECT sf.storage_key
                    FROM stored_files sf
                    WHERE sf.resource_type = 'products'
                      AND sf.resource_id = qi.product_id
                      AND sf.asset_role = 'image'
                      AND sf.slot_key = 'primary'
                      AND sf.is_current = TRUE
                    LIMIT 1
                ) AS image_storage_key
            FROM quote_items qi
            INNER JOIN products p ON p.id = qi.product_id
            WHERE qi.quote_id = $1
            ORDER BY qi.id ASC
        `,
        [id],
    );

    return toQuoteDetail(quote.rows[0], items.rows.map(toQuoteItem));
}

export async function saveGeneratedDocument(
    quoteId: number,
    createdBy: number | null,
    input: {
        storageKey: string;
        fileName: string;
        sizeBytes: number;
        sha256: string;
    },
): Promise<number> {
    return withTransaction(async (client) => {
        const current = await client.query<{ version: number }>(
            `
                SELECT version
                FROM stored_files
                WHERE resource_type = 'quotes'
                  AND resource_id = $1
                  AND asset_role = 'document'
                  AND slot_key = 'commercial_quote'
                  AND is_current = TRUE
                LIMIT 1
                FOR UPDATE
            `,
            [quoteId],
        );
        const nextVersion = (current.rows[0]?.version ?? 0) + 1;

        await client.query(
            `
                UPDATE stored_files
                SET is_current = FALSE
                WHERE resource_type = 'quotes'
                  AND resource_id = $1
                  AND asset_role = 'document'
                  AND slot_key = 'commercial_quote'
                  AND is_current = TRUE
            `,
            [quoteId],
        );

        const inserted = await client.query<{ id: string | number }>(
            `
                INSERT INTO stored_files (
                    resource_type, resource_id, asset_role, slot_key, version,
                    storage_key, file_name, mime_type, file_size_bytes, sha256,
                    is_current, created_by
                )
                VALUES ('quotes',$1,'document','commercial_quote',$2,$3,$4,'application/pdf',$5,$6,TRUE,$7)
                RETURNING id
            `,
            [quoteId, nextVersion, input.storageKey, input.fileName, input.sizeBytes, input.sha256, createdBy],
        );

        return Number(inserted.rows[0].id);
    });
}

export async function createEmailDelivery(input: {
    quoteId: number;
    documentFileId: number;
    recipientEmail: string;
    idempotencyKey: string;
}): Promise<number> {
    const result = await db.query<{ id: string | number }>(
        `
            INSERT INTO quote_email_deliveries (
                quote_id, document_file_id, attempt_type, recipient_email,
                provider, status, idempotency_key
            )
            VALUES ($1,$2,'send',$3,'resend','pending',$4)
            RETURNING id
        `,
        [input.quoteId, input.documentFileId, input.recipientEmail, input.idempotencyKey],
    );
    return Number(result.rows[0].id);
}

export async function markEmailDeliverySent(input: {
    deliveryId: number;
    quoteId: number;
    provider: string;
    providerMessageId: string;
}): Promise<void> {
    await withTransaction(async (client) => {
        await client.query(
            `
                UPDATE quote_email_deliveries
                SET provider = $2,
                    provider_message_id = $3,
                    status = 'sent',
                    sent_at = CURRENT_TIMESTAMP
                WHERE id = $1
            `,
            [input.deliveryId, input.provider, input.providerMessageId],
        );
        await client.query(
            `
                UPDATE quotes
                SET status = 'sent', sent_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
                WHERE id = $1
            `,
            [input.quoteId],
        );
    });
}

export async function markEmailDeliveryFailed(
    deliveryId: number,
    quoteId: number,
    code: string,
    message: string,
): Promise<void> {
    await withTransaction(async (client) => {
        await client.query(
            `
                UPDATE quote_email_deliveries
                SET status = 'failed', error_code = $2, error_message = $3
                WHERE id = $1
            `,
            [deliveryId, code, message.slice(0, 1000)],
        );
    });
}
