import { db } from "../../../database/db.js";
import {
    toCategory,
    type CategoryRow,
} from "../categories.mapper.js";
import type {
    Category ,
    CreateCategoryInput,
} from "../categories.types.js";
import { CATEGORY_COLUMNS } from "./categories.repository.constants.js";

export async function create(
    input: CreateCategoryInput,
): Promise<Category> {
    const result = await db.query<CategoryRow>(`
        INSERT INTO categories (
            name,
            slug,
            description,
            is_active
        )
        VALUES($1, $2, $3, $4)
        RETURNING ${CATEGORY_COLUMNS}
    `, [
        input.name,
        input.slug,
        input.description ?? null,
        input.isActive ?? true,
    ]);

    return toCategory(result.rows[0]);
}
