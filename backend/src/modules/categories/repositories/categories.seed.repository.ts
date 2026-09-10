import {
    db,
} from "../../../database/db.js";

import type {
    CreateCategoryInput,
} from "../categories.types.js";

export async function createSeedCategoryIfMissing(
    input: CreateCategoryInput,
): Promise<number> {
    const insertResult =
        await db.query<{ id: number }>(
            `
                INSERT INTO categories (
                    name,
                    slug,
                    description,
                    is_active
                )
                VALUES ($1, $2, $3, TRUE)
                ON CONFLICT DO NOTHING
                RETURNING id
            `,
            [
                input.name,
                input.slug,
                input.description ?? null,
            ],
        );

    if (insertResult.rows[0]) {
        return insertResult.rows[0].id;
    }

    const existingResult =
        await db.query<{ id: number }>(
            `
                SELECT id
                FROM categories
                WHERE slug = $1
                LIMIT 1
            `,
            [input.slug],
        );

    if (!existingResult.rows[0]) {
        throw new Error(
            `No se pudo resolver la categoría del seed: ${input.slug}`,
        );
    }

    return existingResult.rows[0].id;
}
