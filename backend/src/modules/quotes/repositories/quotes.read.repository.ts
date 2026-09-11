import { db } from "../../../database/db.js";
import type { QuoteProductSnapshot } from "../quotes.types.js";

interface QuoteProductSnapshotRow {
    id: number;
    name: string;
}

export async function findActiveProductsByIds(
    productIds: readonly number[],
): Promise<QuoteProductSnapshot[]> {
    const result = await db.query<QuoteProductSnapshotRow>(
        `
            SELECT id, name
            FROM products
            WHERE id = ANY($1::int[])
                AND is_active = TRUE
        `,
        [productIds],
    );

    return result.rows.map((row) => ({
        id: row.id,
        name: row.name,
    }));
}

export async function reserveQuoteReferenceNumber(): Promise<number> {
    const result = await db.query<{ value: number }>(
        "SELECT nextval('quote_reference_seq')::integer AS value",
    );

    return result.rows[0].value;
}
