import { db } from "../../../database/db.js";
import {
    toCategory,
    type CategoryRow,
} from "../categories.mapper.js"
import type {
    Category,
    UpdateCategoryInput
} from "../categories.types.js";
import { CATEGORY_COLUMNS } from "./categories.repository.constants.js";
import { findById } from "./categories.read.repository.js";

export async function update(
    id: number,
    input: UpdateCategoryInput,
): Promise<Category | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    const addField = (
        column: string,
        value: unknown,
    ): void => {
        values.push(value);

        fields.push(`${column} =  $${values.length}`);
    };

    if (input.name !== undefined) {
        addField(
            "name",
            input.name,
        );
    }

    if (input.slug !== undefined) {
        addField(
            "slug",
            input.slug,
        );
    }

    if (input.description !== undefined) {
        addField(
            "description",
            input.description,
        );
    }

    if (input.isActive !== undefined) {
        addField(
            "is_active",
            input.isActive,
        );
    }

    if (fields.length === 0) {
        return findById(id);
    }

    fields.push(
        "updated_at = CURRENT_TIMESTAMP",
    );

    values.push(id);

    const result = await db.query<CategoryRow>(`
        UPDATE categories
        SET ${fields.join(", ")}
        WHERE id = $${values.length}

        RETURNING ${CATEGORY_COLUMNS}
    `, values);

    return result.rows[0]
        ? toCategory(result.rows[0])
        : null;
}

export async function deactivate(
    id: number,
): Promise<Category | null> {
    const result = await db.query<CategoryRow>(`
        UPDATE categories
        SET
            is_active = FALSE,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
            AND is_active = TRUE

        RETURNING ${CATEGORY_COLUMNS}
    `, [id]);

    return result.rows[0]
        ? toCategory(result.rows[0])
        : null;
}
