import { db } from "../../../database/db.js";
import { toProduct, type ProductRow } from "../products.mapper.js";
import type { Product } from "../products.types.js";
import { PRODUCT_COLUMNS } from "./products.repository.constants.js";

export async function findAllActive(): Promise<Product[]> {
    const result = await db.query<ProductRow>(`
        SELECT ${PRODUCT_COLUMNS}
        FROM products
        WHERE is_active = TRUE
        ORDER BY id ASC
    `);

    return result.rows.map(toProduct);
}

export async function findAll(): Promise<Product[]> {
    const result = await db.query<ProductRow>(`
        SELECT ${PRODUCT_COLUMNS}
        FROM products
        ORDER BY id ASC
    `);

    return result.rows.map(toProduct);
}

export async function findActiveById(id: number): Promise<Product | null> {
    const result = await db.query<ProductRow>(
        `
            SELECT ${PRODUCT_COLUMNS}
            FROM products
            WHERE id = $1
                AND is_active = TRUE
            LIMIT 1
        `,
        [id],
    );

    return result.rows[0] ? toProduct(result.rows[0]) : null;
}

export async function findById(id: number): Promise<Product | null> {
    const result = await db.query<ProductRow>(
        `
            SELECT ${PRODUCT_COLUMNS}
            FROM products
            WHERE id = $1
            LIMIT 1
        `,
        [id],
    );

    return result.rows[0] ? toProduct(result.rows[0]) : null;
}

export async function categoryExists(
    categoryId: number,
): Promise<boolean> {
    const result = await db.query(
        `
            SELECT 1
            FROM categories
            WHERE id = $1
                AND is_active = TRUE
            LIMIT 1
        `,
        [categoryId],
    );

    return Boolean(result.rowCount);
}
