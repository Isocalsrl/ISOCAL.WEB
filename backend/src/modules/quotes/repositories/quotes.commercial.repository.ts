import { withTransaction } from "../../../database/transaction.js";
import { toQuote, type QuoteRow } from "../quotes.mapper.js";
import type {
    Quote,
    QuoteCommercialDetailsInput,
    QuoteCurrency,
    QuoteStatus,
} from "../quotes.types.js";
import { invalidateCurrentQuoteDocument } from "./quotes.document.repository.js";
import { insertQuoteEvent } from "./quotes.events.repository.js";
import { QUOTE_COLUMNS } from "./quotes.repository.constants.js";

interface CurrentCommercialDetails {
    currency: QuoteCurrency;
    valid_until: string | null;
    payment_terms: string | null;
    commercial_notes: string | null;
    internal_notes: string | null;
}

export async function updateCommercialDetails(
    id: number,
    actorAdminId: number,
    input: QuoteCommercialDetailsInput,
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

        const toStatus = fromStatus === "ready_to_send" ? "priced" : fromStatus;
        const currentDetails = await client.query<CurrentCommercialDetails>(
            `SELECT currency, valid_until, payment_terms, commercial_notes, internal_notes
             FROM quotes
             WHERE id = $1`,
            [id],
        );
        const details = currentDetails.rows[0];

        if (!details) {
            return null;
        }

        const result = await client.query<QuoteRow>(
            `UPDATE quotes
             SET currency = COALESCE($1, currency),
                 valid_until = $2,
                 payment_terms = $3,
                 commercial_notes = $4,
                 internal_notes = $5,
                 status = $6,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $7
             RETURNING ${QUOTE_COLUMNS}`,
            [
                input.currency === undefined ? details.currency : input.currency,
                input.validUntil === undefined ? details.valid_until : input.validUntil,
                input.paymentTerms === undefined
                    ? details.payment_terms
                    : input.paymentTerms,
                input.commercialNotes === undefined
                    ? details.commercial_notes
                    : input.commercialNotes,
                input.internalNotes === undefined
                    ? details.internal_notes
                    : input.internalNotes,
                toStatus,
                id,
            ],
        );

        if (fromStatus === "ready_to_send") {
            await invalidateCurrentQuoteDocument(client, id);
        }

        await insertQuoteEvent(client, {
            quoteId: id,
            actorAdminId,
            eventType: "commercial_details_updated",
            fromStatus,
            toStatus,
        });

        return toQuote(result.rows[0]);
    });
}
