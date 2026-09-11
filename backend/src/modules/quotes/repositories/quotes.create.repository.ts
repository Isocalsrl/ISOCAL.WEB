import { withTransaction } from "../../../database/transaction.js";
import { toQuote, type QuoteRow } from "../quotes.mapper.js";
import type { CreateQuoteRecordInput, Quote } from "../quotes.types.js";
import { QUOTE_COLUMNS } from "./quotes.repository.constants.js";

export async function createQuoteWithItems(
    input: CreateQuoteRecordInput,
): Promise<Quote> {
    return withTransaction(async (client) => {
        const quoteResult = await client.query<QuoteRow>(
            `
                INSERT INTO quotes (
                    reference,
                    customer_name,
                    customer_email,
                    customer_phone,
                    company_name,
                    ruc,
                    job_title,
                    location,
                    customer_notes,
                    status
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
                RETURNING ${QUOTE_COLUMNS}
            `,
            [
                input.reference,
                input.customerName,
                input.customerEmail,
                input.customerPhone,
                input.companyName,
                input.ruc,
                input.jobTitle,
                input.location,
                input.customerNotes,
            ],
        );

        const quote = toQuote(quoteResult.rows[0]);

        for (const item of input.items) {
            await client.query(
                `
                    INSERT INTO quote_items (
                        quote_id,
                        product_id,
                        product_name,
                        quantity,
                        customer_notes
                    )
                    VALUES ($1, $2, $3, $4, $5)
                `,
                [
                    quote.id,
                    item.productId,
                    item.productName,
                    item.quantity,
                    item.customerNotes,
                ],
            );
        }

        return quote;
    });
}
