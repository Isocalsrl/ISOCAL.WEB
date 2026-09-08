import { db } from "../../../database/db.js";
import { toProduct, type ProductRow } from "../products.mapper.js";
import type { CreateProductInput, Product } from "../products.types.js";
import { PRODUCT_COLUMNS } from "./products.repository.constants.js";

export async function create(input: CreateProductInput): Promise<Product> {
    const result = await db.query<ProductRow>(
        `
            INSERT INTO products (
                name,
                slug,
                description,
                category_id,
                is_active
            )
            VALUES ($1, $2, $3, $4, $5)

            RETURNING ${PRODUCT_COLUMNS}
        `,
        [
            input.name,
            input.slug,
            input.description ?? null,
            input.categoryId ?? null,
            input.isActive ?? true,
        ],
    );

    return toProduct(result.rows[0]);
}
