import { withTransaction } from "../../../database/transaction.js";
import { toQuote, type QuoteRow } from "../quotes.mapper.js";
import type {
    Quote,
    QuotePricingItemInput,
    QuoteStatus,
} from "../quotes.types.js";
import { invalidateCurrentQuoteDocument } from "./quotes.document.repository.js";
import { insertQuoteEvent } from "./quotes.events.repository.js";
import { QUOTE_COLUMNS } from "./quotes.repository.constants.js";

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

export async function refreshStoredQuotePricing(
    input: RefreshStoredPricingInput,
): Promise<boolean> {
    return withTransaction(async (client) => {
        const lock = await client.query(
            "SELECT id FROM quotes WHERE id = $1 AND status = 'priced' FOR UPDATE",
            [input.quoteId],
        );

        if (lock.rowCount !== 1) {
            return false;
        }

        for (const item of input.items) {
            const result = await client.query(
                `UPDATE quote_items
                 SET unit_price = $1, discount_amount = $2, subtotal = $3
                 WHERE id = $4 AND quote_id = $5`,
                [
                    item.unitPrice,
                    item.discountAmount ?? 0,
                    item.subtotal,
                    item.itemId,
                    input.quoteId,
                ],
            );

            if (result.rowCount !== 1) {
                throw new Error(
                    "No se pudo recalcular uno de los items de la cotización.",
                );
            }
        }

        await client.query(
            `UPDATE quotes
             SET subtotal = $2,
                 discount_amount = $3,
                 tax_rate = $4,
                 tax_amount = $5,
                 total = $6,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [
                input.quoteId,
                input.subtotal,
                input.discountAmount,
                input.taxRate,
                input.taxAmount,
                input.total,
            ],
        );

        return true;
    });
}

export async function updatePricing(
    id: number,
    actorAdminId: number,
    input: PricingUpdateRecord,
): Promise<Quote | null> {
    return withTransaction(async (client) => {
        const current = await client.query<{ status: QuoteStatus }>(
            "SELECT status FROM quotes WHERE id = $1 FOR UPDATE",
            [id],
        );
        const fromStatus = current.rows[0]?.status;

        if (!fromStatus) {
            return null;
        }

        for (const item of input.items) {
            await client.query(
                `UPDATE quote_items
                 SET unit_price = $1, discount_amount = $2, subtotal = $3
                 WHERE id = $4 AND quote_id = $5`,
                [
                    item.unitPrice,
                    item.discountAmount ?? 0,
                    item.subtotal,
                    item.itemId,
                    id,
                ],
            );
        }

        const result = await client.query<QuoteRow>(
            `UPDATE quotes
             SET subtotal = $1,
                 discount_amount = $2,
                 tax_rate = $3,
                 tax_amount = $4,
                 total = $5,
                 priced_by = $6,
                 priced_at = CURRENT_TIMESTAMP,
                 status = 'priced',
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $7
             RETURNING ${QUOTE_COLUMNS}`,
            [
                input.subtotal,
                input.discountAmount,
                input.taxRate,
                input.taxAmount,
                input.total,
                actorAdminId,
                id,
            ],
        );

        if (fromStatus === "ready_to_send") {
            await invalidateCurrentQuoteDocument(client, id);
        }

        await insertQuoteEvent(client, {
            quoteId: id,
            actorAdminId,
            eventType: "pricing_updated",
            fromStatus,
            toStatus: "priced",
        });

        return toQuote(result.rows[0]);
    });
}
