import { db, type DatabaseConnection } from "../../database/db.js";
import { toProduct, type ProductRow } from "./products.mapper.js";
import type { CreateProductInput, Product, ProductImageAsset, UpdateProductInput } from "./products.types.js";

const productColumns = `
    id,
    name,
    slug,
    description,
    category_id,
    is_active,
    created_at,
    updated_at
`;

const productListColumns = `
    p.id,
    p.name,
    p.slug,
    p.description,
    p.category_id,
    (
        SELECT sf.version
        FROM stored_files sf
        WHERE sf.resource_type = 'products'
          AND sf.resource_id = p.id
          AND sf.asset_role = 'image'
          AND sf.slot_key = 'primary'
          AND sf.is_current = TRUE
        LIMIT 1
    ) AS image_version,
    p.is_active,
    p.created_at,
    p.updated_at
`;

const currentImagePredicate = `
    resource_type = 'products'
    AND resource_id = $1
    AND asset_role = 'image'
    AND slot_key = 'primary'
    AND is_current = TRUE
`;

interface ProductImageRow {
    storage_key: string;
    file_name: string;
    mime_type: string;
    file_size_bytes: string | number;
    sha256: string;
    version: number;
}

export interface SaveProductImageInput {
    productId: number;
    storageKey: string;
    fileName: string;
    mimeType: string;
    fileSizeBytes: number;
    sha256: string;
    createdBy: number;
}

function toProductImage(row: ProductImageRow): ProductImageAsset {
    return {
        storageKey: row.storage_key,
        fileName: row.file_name,
        mimeType: row.mime_type,
        fileSizeBytes: Number(row.file_size_bytes),
        sha256: row.sha256,
        version: row.version,
    };
}

export async function findAll(activeOnly = false): Promise<Product[]> {
    const result = await db.query<ProductRow>(`
        SELECT ${productListColumns}
        FROM products p
        ${activeOnly ? "WHERE p.is_active = TRUE" : ""}
        ORDER BY p.id ASC
    `);
    return result.rows.map(toProduct);
}

export async function findActiveByCategory(categoryId: number): Promise<Product[]> {
    const result = await db.query<ProductRow>(`
        SELECT ${productListColumns}
        FROM products p
        WHERE p.category_id = $1
          AND p.is_active = TRUE
        ORDER BY p.name ASC, p.id ASC
    `, [categoryId]);
    return result.rows.map(toProduct);
}

export async function findById(id: number, activeOnly = false): Promise<Product | null> {
    const result = await db.query<ProductRow>(`
        SELECT ${productListColumns}
        FROM products p
        WHERE p.id = $1
          ${activeOnly ? "AND p.is_active = TRUE" : ""}
        LIMIT 1
    `, [id]);
    return result.rows[0] ? toProduct(result.rows[0]) : null;
}

async function findByIdWithClient(client: DatabaseConnection, id: number): Promise<Product | null> {
    const result = await client.query<ProductRow>(`
        SELECT ${productColumns}
        FROM products
        WHERE id = $1
        LIMIT 1
    `, [id]);
    return result.rows[0] ? toProduct(result.rows[0]) : null;
}

export async function findByIdForUpdate(client: DatabaseConnection, id: number): Promise<Product | null> {
    const result = await client.query<ProductRow>(`
        SELECT ${productColumns}
        FROM products
        WHERE id = $1
        LIMIT 1
        FOR UPDATE
    `, [id]);
    return result.rows[0] ? toProduct(result.rows[0]) : null;
}

export async function categoryExists(categoryId: number): Promise<boolean> {
    const result = await db.query(`
        SELECT 1
        FROM categories
        WHERE id = $1
          AND is_active = TRUE
        LIMIT 1
    `, [categoryId]);
    return result.rowCount > 0;
}

export async function create(client: DatabaseConnection, input: CreateProductInput): Promise<Product> {
    const result = await client.query(`
        INSERT INTO products (name, slug, description, category_id, is_active)
        VALUES ($1, $2, $3, $4, $5)
    `, [input.name, input.slug, input.description ?? null, input.categoryId ?? null, input.isActive ?? true]);
    const created = await findByIdWithClient(client, result.insertId);
    if (!created) throw new Error("No se pudo recuperar el producto creado.");
    return created;
}

export async function update(client: DatabaseConnection, id: number, input: UpdateProductInput): Promise<Product | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    const addField = (column: string, value: unknown): void => {
        values.push(value);
        fields.push(`${column} = $${values.length}`);
    };

    if (input.name !== undefined) addField("name", input.name);
    if (input.slug !== undefined) addField("slug", input.slug);
    if (input.description !== undefined) addField("description", input.description);
    if (input.categoryId !== undefined) addField("category_id", input.categoryId);
    if (input.isActive !== undefined) addField("is_active", input.isActive);
    if (fields.length === 0) return null;

    fields.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);
    const result = await client.query(`
        UPDATE products
        SET ${fields.join(", ")}
        WHERE id = $${values.length}
    `, values);
    if (result.rowCount === 0) return null;
    return findByIdWithClient(client, id);
}

export async function touch(client: DatabaseConnection, id: number): Promise<void> {
    await client.query("UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = $1", [id]);
}

export async function deactivate(id: number): Promise<Product | null> {
    const result = await db.query(`
        UPDATE products
        SET is_active = FALSE,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND is_active = TRUE
    `, [id]);
    if (result.rowCount === 0) return null;
    return findById(id);
}

export async function findCurrentImage(productId: number): Promise<ProductImageAsset | null> {
    const result = await db.query<ProductImageRow>(`
        SELECT storage_key, file_name, mime_type, file_size_bytes, sha256, version
        FROM stored_files
        WHERE ${currentImagePredicate}
        LIMIT 1
    `, [productId]);
    return result.rows[0] ? toProductImage(result.rows[0]) : null;
}

export async function hasCurrentImage(client: DatabaseConnection, productId: number): Promise<boolean> {
    const result = await client.query(`SELECT 1 FROM stored_files WHERE ${currentImagePredicate} LIMIT 1`, [productId]);
    return result.rowCount > 0;
}

export async function replaceCurrentImage(client: DatabaseConnection, input: SaveProductImageInput): Promise<void> {
    const current = await client.query<{ version: number }>(`
        SELECT version
        FROM stored_files
        WHERE ${currentImagePredicate}
        LIMIT 1
        FOR UPDATE
    `, [input.productId]);
    const nextVersion = (current.rows[0]?.version ?? 0) + 1;

    await client.query(`UPDATE stored_files SET is_current = FALSE WHERE ${currentImagePredicate}`, [input.productId]);
    await client.query(`
        INSERT INTO stored_files (
            resource_type,
            resource_id,
            asset_role,
            slot_key,
            version,
            storage_key,
            file_name,
            mime_type,
            file_size_bytes,
            sha256,
            is_current,
            created_by
        )
        VALUES ('products', $1, 'image', 'primary', $2, $3, $4, $5, $6, $7, TRUE, $8)
    `, [
        input.productId,
        nextVersion,
        input.storageKey,
        input.fileName,
        input.mimeType,
        input.fileSizeBytes,
        input.sha256,
        input.createdBy,
    ]);
}
