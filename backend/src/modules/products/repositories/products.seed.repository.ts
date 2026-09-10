import {
    db,
} from "../../../database/db.js";

import type {
    CreateProductInput,
} from "../products.types.js";

export async function createSeedProductIfMissing(
    input: CreateProductInput,
): Promise<boolean> {
    const result = await db.query(
        `
            INSERT INTO products (
                name,
                slug,
                description,
                category_id,
                is_active
            )
            VALUES ($1, $2, $3, $4, TRUE)
            ON CONFLICT DO NOTHING
            RETURNING id
        `,
        [
            input.name,
            input.slug,
            input.description ?? null,
            input.categoryId ?? null,
        ],
    );

    return result.rowCount === 1;
}
