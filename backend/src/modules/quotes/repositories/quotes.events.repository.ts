import type { PoolClient } from "pg";

import type {
    QuoteEventType,
    QuoteStatus,
} from "../quotes.types.js";

export interface QuoteEventInput {
    quoteId: number;
    actorAdminId: number | null;
    eventType: QuoteEventType;
    fromStatus: QuoteStatus | null;
    toStatus: QuoteStatus | null;
    note?: string | null;
}

export async function insertQuoteEvent(
    client: PoolClient,
    input: QuoteEventInput,
): Promise<void> {
    await client.query(
        `INSERT INTO quote_events (
            quote_id,
            actor_admin_id,
            event_type,
            from_status,
            to_status,
            note
         )
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
            input.quoteId,
            input.actorAdminId,
            input.eventType,
            input.fromStatus,
            input.toStatus,
            input.note ?? null,
        ],
    );
}
