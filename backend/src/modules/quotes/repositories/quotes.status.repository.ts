import { withTransaction } from "../../../database/transaction.js";
import { toQuote, type QuoteRow } from "../quotes.mapper.js";
import type { Quote, QuoteStatus } from "../quotes.types.js";
import { insertQuoteEvent } from "./quotes.events.repository.js";
import { QUOTE_COLUMNS } from "./quotes.repository.constants.js";

export async function startReview(
    id: number,
    actorAdminId: number,
): Promise<Quote | null> {
    return withTransaction(async (client) => {
        const result = await client.query<QuoteRow>(
            `UPDATE quotes
             SET status = 'in_review', updated_at = CURRENT_TIMESTAMP
             WHERE id = $1 AND status = 'pending'
             RETURNING ${QUOTE_COLUMNS}`,
            [id],
        );

        if (!result.rows[0]) {
            return null;
        }

        await insertQuoteEvent(client, {
            quoteId: id,
            actorAdminId,
            eventType: "review_started",
            fromStatus: "pending",
            toStatus: "in_review",
        });

        return toQuote(result.rows[0]);
    });
}

export async function prepareQuote(
    id: number,
    actorAdminId: number,
): Promise<Quote | null> {
    return withTransaction(async (client) => {
        const result = await client.query<QuoteRow>(
            `UPDATE quotes
             SET status = 'ready_to_send', updated_at = CURRENT_TIMESTAMP
             WHERE id = $1 AND status = 'priced'
             RETURNING ${QUOTE_COLUMNS}`,
            [id],
        );

        if (!result.rows[0]) {
            return null;
        }

        await insertQuoteEvent(client, {
            quoteId: id,
            actorAdminId,
            eventType: "prepared",
            fromStatus: "priced",
            toStatus: "ready_to_send",
        });

        return toQuote(result.rows[0]);
    });
}

export async function rejectQuote(
    id: number,
    actorAdminId: number,
    reason: string | null,
): Promise<Quote | null> {
    return withTransaction(async (client) => {
        const current = await client.query<{ status: QuoteStatus }>(
            "SELECT status FROM quotes WHERE id = $1 FOR UPDATE",
            [id],
        );
        const fromStatus = current.rows[0]?.status;

        if (!fromStatus || fromStatus === "sent" || fromStatus === "rejected") {
            return null;
        }

        const result = await client.query<QuoteRow>(
            `UPDATE quotes
             SET status = 'rejected', updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING ${QUOTE_COLUMNS}`,
            [id],
        );

        if (!result.rows[0]) {
            return null;
        }

        await insertQuoteEvent(client, {
            quoteId: id,
            actorAdminId,
            eventType: "rejected",
            fromStatus,
            toStatus: "rejected",
            note: reason,
        });

        return toQuote(result.rows[0]);
    });
}
