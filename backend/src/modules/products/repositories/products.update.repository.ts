import type { PoolClient } from "pg";
import { db } from "../../../database/db.js";
import { toProduct, type ProductRow } from "../products.mapper.js";
import type { Product, UpdateProductInput } from "../products.types.js";
import { PRODUCT_COLUMNS } from "./products.repository.constants.js";

export async function update(
    client: PoolClient,
    id: number,
    input: UpdateProductInput,
): Promise<Product | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    const addField = (column: string, value: unknown) => {
        values.push(value);
        fields.push(`${column} = $${values.length}`);
    };

    if (input.name !== undefined) {
        addField("name", input.name);
    }

    if (input.slug !== undefined) {
        addField("slug", input.slug);
    }

    if (input.description !== undefined) {
        addField("description", input.description);
    }

    if (input.categoryId !== undefined) {
        addField("category_id", input.categoryId);
    }

    if (input.isActive !== undefined) {
        addField(
            "is_active",
            input.isActive,
        );
    }

    if (fields.length === 0) {
        return null;
    }

    fields.push("updated_at = CURRENT_TIMESTAMP");

    values.push(id);

    const result = await client.query<ProductRow>(
        `
            UPDATE products
            SET ${fields.join(", ")}
            WHERE id = $${values.length}

            RETURNING ${PRODUCT_COLUMNS}
        `,
        values,
    );

    return result.rows[0] ? toProduct(result.rows[0]) : null;
}

export async function touch(client: PoolClient, id: number): Promise<void> {
    await client.query(
        `UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [id],
    );
}

export async function deactivate(id: number): Promise<Product | null> {
    const result = await db.query<ProductRow>(
        `
            UPDATE products
            SET
                is_active = FALSE,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
                AND is_active = TRUE

            RETURNING ${PRODUCT_COLUMNS}
        `,
        [id],
    );

    return result.rows[0] ? toProduct(result.rows[0]) : null;
}
