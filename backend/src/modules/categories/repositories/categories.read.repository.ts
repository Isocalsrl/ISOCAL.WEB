import { db } from "../../../database/db.js";
import {
    toCategory,
    type CategoryRow,
} from "../categories.mapper.js";
import type { Category } from "../categories.types.js";
import {
    toProduct,
    type ProductRow,
} from "../../products/products.mapper.js";
import type { Product } from "../../products/products.types.js";
import { CATEGORY_COLUMNS } from "./categories.repository.constants.js";
import { PRODUCT_COLUMNS } from "../../products/repositories/products.repository.constants.js";

export async function findAllActive(): Promise<Category[]> {
    const result = await db.query<CategoryRow>(`
        SELECT ${CATEGORY_COLUMNS}
        FROM categories
        WHERE is_active = TRUE
        ORDER BY name ASC, id ASC
    `);

    return result.rows.map(toCategory);
}

export async function findAll(): Promise<Category[]> {
    const result = await db.query<CategoryRow>(`
        SELECT ${CATEGORY_COLUMNS}
        FROM categories
        ORDER BY name ASC, id ASC
    `);

    return result.rows.map(toCategory);
}

export async function findActiveById(
    id: number
): Promise<Category | null> {
    const result = await db.query<CategoryRow>(
        `
            SELECT ${CATEGORY_COLUMNS}
            FROM categories
            WHERE id = $1
                AND is_active = TRUE
            LIMIT 1
        `,
        [id],
    );

    return result.rows[0]
        ? toCategory(result.rows[0])
        : null;
}

export async function findById(
    id: number
): Promise<Category | null> {
    const result = await db.query<CategoryRow>(
        `
            SELECT ${CATEGORY_COLUMNS}
            FROM categories
            WHERE id = $1
            LIMIT 1
        `,
        [id],
    );

    return result.rows[0]
        ? toCategory(result.rows[0])
        : null;
}

export async function findActiveProductsByCategoryId(
    categoryId: number
): Promise<Product[]> {
    const result = await db.query<ProductRow>(`
        SELECT ${PRODUCT_COLUMNS}
        FROM products
        WHERE category_id = $1
            AND is_active = TRUE
        ORDER BY name ASC, id ASC
    `, [categoryId]);

    return result.rows.map(toProduct);
}

export async function hasAssociatedProducts(
    categoryId: number
): Promise<boolean> {
    const result = await db.query(`
        SELECT 1
        FROM products
        WHERE category_id = $1
        LIMIT 1
    `, [categoryId]);

    return Boolean(result.rowCount);
}
