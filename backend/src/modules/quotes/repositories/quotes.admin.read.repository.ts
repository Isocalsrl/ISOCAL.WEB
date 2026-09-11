import { db } from "../../../database/db.js";
import { toQuote, toQuoteItem, toQuoteHistoryEvent, type QuoteItemRow, type QuoteHistoryEventRow, type QuoteRow } from "../quotes.mapper.js";
import type { Quote, QuoteHistoryEvent, QuoteItem, QuoteStatus } from "../quotes.types.js";
import { QUOTE_COLUMNS, QUOTE_ITEM_COLUMNS } from "./quotes.repository.constants.js";

export interface AdminQuoteListRecord {
    quote: Quote;
    itemCount: number;
}

export async function findAdminQuotes(status?: QuoteStatus): Promise<AdminQuoteListRecord[]> {
    const result = await db.query<QuoteRow & { item_count: string }>(
        `
            SELECT q.*, COUNT(qi.id)::text AS item_count
            FROM quotes q
            LEFT JOIN quote_items qi ON qi.quote_id = q.id
            ${status ? "WHERE q.status = $1" : ""}
            GROUP BY q.id
            ORDER BY q.created_at DESC
        `,
        status ? [status] : [],
    );

    return result.rows.map((row) => ({ quote: toQuote(row), itemCount: Number(row.item_count) }));
}

export async function findAdminQuoteById(id: number): Promise<{ quote: Quote; items: QuoteItem[] } | null> {
    const quoteResult = await db.query<QuoteRow>(
        `SELECT ${QUOTE_COLUMNS} FROM quotes WHERE id = $1 LIMIT 1`,
        [id],
    );
    if (!quoteResult.rows[0]) return null;

    const itemResult = await db.query<QuoteItemRow>(
        `SELECT ${QUOTE_ITEM_COLUMNS} FROM quote_items WHERE quote_id = $1 ORDER BY id ASC`,
        [id],
    );
    return { quote: toQuote(quoteResult.rows[0]), items: itemResult.rows.map(toQuoteItem) };
}

export async function findQuoteHistory(id: number): Promise<QuoteHistoryEvent[]> {
    const result = await db.query<QuoteHistoryEventRow>(
        `
            SELECT qe.id, qe.quote_id, qe.actor_admin_id, a.name AS actor_admin_name,
                   qe.event_type, qe.from_status, qe.to_status, qe.note, qe.created_at
            FROM quote_events qe
            LEFT JOIN admins a ON a.id = qe.actor_admin_id
            WHERE qe.quote_id = $1
            ORDER BY qe.created_at DESC, qe.id DESC
        `,
        [id],
    );
    return result.rows.map(toQuoteHistoryEvent);
}
