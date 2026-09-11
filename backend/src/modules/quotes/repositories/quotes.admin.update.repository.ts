import { db } from "../../../database/db.js";
import type { PoolClient } from "pg";
import { toQuote, type QuoteRow } from "../quotes.mapper.js";
import type { Quote, QuoteCommercialDetailsInput, QuotePricingItemInput, QuoteStatus } from "../quotes.types.js";
import { QUOTE_COLUMNS } from "./quotes.repository.constants.js";

async function recordEvent(
    client: PoolClient,
    quoteId: number,
    actorAdminId: number,
    eventType: string,
    fromStatus: QuoteStatus,
    toStatus: QuoteStatus,
    note?: string | null,
): Promise<void> {
    await client.query(
        `INSERT INTO quote_events (quote_id, actor_admin_id, event_type, from_status, to_status, note) VALUES ($1, $2, $3, $4, $5, $6)`,
        [quoteId, actorAdminId, eventType, fromStatus, toStatus, note ?? null],
    );
}

async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await db.connect();
    try {
        await client.query("BEGIN");
        const result = await callback(client);
        await client.query("COMMIT");
        return result;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function startReview(id: number, actorAdminId: number): Promise<Quote | null> {
    return withTransaction(async (client) => {
        const result = await client.query<QuoteRow>(
            `UPDATE quotes SET status = 'in_review', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND status = 'pending' RETURNING ${QUOTE_COLUMNS}`,
            [id],
        );
        if (!result.rows[0]) return null;
        await recordEvent(client, id, actorAdminId, "review_started", "pending", "in_review");
        return toQuote(result.rows[0]);
    });
}

export interface PricingUpdateRecord {
    items: Array<QuotePricingItemInput & { subtotal: number }>;
    discountAmount: number;
    taxRate: number;
    subtotal: number;
    taxAmount: number;
    total: number;
}

export interface RefreshStoredPricingInput {
    quoteId: number;
    items: Array<QuotePricingItemInput & { subtotal: number }>;
    subtotal: number;
    discountAmount: number;
    taxRate: number;
    taxAmount: number;
    total: number;
}

export async function refreshStoredQuotePricing(input: RefreshStoredPricingInput): Promise<boolean> {
    return withTransaction(async (client) => {
        const lock = await client.query("SELECT id FROM quotes WHERE id = $1 AND status = 'priced' FOR UPDATE", [input.quoteId]);
        if (lock.rowCount !== 1) return false;
        for (const item of input.items) {
            const result = await client.query(
                "UPDATE quote_items SET unit_price = $1, discount_amount = $2, subtotal = $3 WHERE id = $4 AND quote_id = $5",
                [item.unitPrice, item.discountAmount ?? 0, item.subtotal, item.itemId, input.quoteId],
            );
            if (result.rowCount !== 1) throw new Error("No se pudo recalcular uno de los items de la cotización.");
        }
        await client.query(
            "UPDATE quotes SET subtotal = $2, discount_amount = $3, tax_rate = $4, tax_amount = $5, total = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $1",
            [input.quoteId, input.subtotal, input.discountAmount, input.taxRate, input.taxAmount, input.total],
        );
        return true;
    });
}

export async function updatePricing(id: number, actorAdminId: number, input: PricingUpdateRecord): Promise<Quote | null> {
    return withTransaction(async (client) => {
        const current = await client.query<{ status: QuoteStatus }>("SELECT status FROM quotes WHERE id = $1 FOR UPDATE", [id]);
        if (!current.rows[0]) return null;
        const fromStatus = current.rows[0].status;

        for (const item of input.items) {
            await client.query(
                `UPDATE quote_items SET unit_price = $1, discount_amount = $2, subtotal = $3 WHERE id = $4 AND quote_id = $5`,
                [item.unitPrice, item.discountAmount ?? 0, item.subtotal, item.itemId, id],
            );
        }

        const result = await client.query<QuoteRow>(
            `UPDATE quotes SET subtotal = $1, discount_amount = $2, tax_rate = $3, tax_amount = $4, total = $5, priced_by = $6, priced_at = CURRENT_TIMESTAMP, status = 'priced', updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING ${QUOTE_COLUMNS}`,
            [input.subtotal, input.discountAmount, input.taxRate, input.taxAmount, input.total, actorAdminId, id],
        );
        if (fromStatus === "ready_to_send") {
            await client.query(
                "UPDATE stored_files SET is_current = FALSE WHERE resource_type = 'quotes' AND resource_id = $1 AND asset_role = 'document' AND slot_key = 'default' AND is_current = TRUE",
                [id],
            );
        }
        await recordEvent(client, id, actorAdminId, "pricing_updated", fromStatus, "priced");
        return toQuote(result.rows[0]);
    });
}

export async function updateCommercialDetails(id: number, actorAdminId: number, input: QuoteCommercialDetailsInput): Promise<Quote | null> {
    return withTransaction(async (client) => {
        const current = await client.query<{ status: QuoteStatus }>("SELECT status FROM quotes WHERE id = $1 FOR UPDATE", [id]);
        if (!current.rows[0]) return null;
        const fromStatus = current.rows[0].status;
        const toStatus = fromStatus === "ready_to_send" ? "priced" : fromStatus;
        const currentDetails = await client.query<{ currency: "PEN"; valid_until: string | null; payment_terms: string | null; commercial_notes: string | null; internal_notes: string | null }>(
            "SELECT currency, valid_until, payment_terms, commercial_notes, internal_notes FROM quotes WHERE id = $1",
            [id],
        );
        const details = currentDetails.rows[0];
        const result = await client.query<QuoteRow>(
            `UPDATE quotes SET currency = COALESCE($1, currency), valid_until = $2, payment_terms = $3, commercial_notes = $4, internal_notes = $5, status = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING ${QUOTE_COLUMNS}`,
            [input.currency === undefined ? details.currency : input.currency, input.validUntil === undefined ? details.valid_until : input.validUntil, input.paymentTerms === undefined ? details.payment_terms : input.paymentTerms, input.commercialNotes === undefined ? details.commercial_notes : input.commercialNotes, input.internalNotes === undefined ? details.internal_notes : input.internalNotes, toStatus, id],
        );
        if (fromStatus === "ready_to_send") {
            await client.query(
                "UPDATE stored_files SET is_current = FALSE WHERE resource_type = 'quotes' AND resource_id = $1 AND asset_role = 'document' AND slot_key = 'default' AND is_current = TRUE",
                [id],
            );
        }
        await recordEvent(client, id, actorAdminId, "commercial_details_updated", fromStatus, toStatus);
        return toQuote(result.rows[0]);
    });
}

export async function prepareQuote(id: number, actorAdminId: number): Promise<Quote | null> {
    return withTransaction(async (client) => {
        const result = await client.query<QuoteRow>(
            `UPDATE quotes SET status = 'ready_to_send', updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND status = 'priced' RETURNING ${QUOTE_COLUMNS}`,
            [id],
        );
        if (!result.rows[0]) return null;
        await recordEvent(client, id, actorAdminId, "prepared", "priced", "ready_to_send");
        return toQuote(result.rows[0]);
    });
}

export async function rejectQuote(id: number, actorAdminId: number, reason: string | null): Promise<Quote | null> {
    return withTransaction(async (client) => {
        const current = await client.query<{ status: QuoteStatus }>("SELECT status FROM quotes WHERE id = $1 FOR UPDATE", [id]);
        if (!current.rows[0] || current.rows[0].status === "sent" || current.rows[0].status === "rejected") return null;
        const result = await client.query<QuoteRow>(
            `UPDATE quotes SET status = 'rejected', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING ${QUOTE_COLUMNS}`,
            [id],
        );
        if (!result.rows[0]) return null;
        await recordEvent(client, id, actorAdminId, "rejected", current.rows[0].status, "rejected", reason);
        return toQuote(result.rows[0]);
    });
}
