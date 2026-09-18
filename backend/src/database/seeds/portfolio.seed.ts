import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { db } from "../db.js";
import portfolio from "./portfolio.data.json";
import { binaryStorage } from "../../shared/storage/storageService.js";
const retiredDemoProducts = [
    "calibracion-de-termometros",
    "calibracion-de-balanzas",
    "implementacion-iso-iec-17025",
    "auditoria-de-sistemas-de-gestion",
];
export async function seedPortfolio(): Promise<void> {
    const client = await db.connect();
    try {
        await client.query("BEGIN");
        await client.query("SELECT pg_advisory_xact_lock(20250915)");
        const categoryIds = new Map<string, number>();
        for (const category of portfolio.categories) {
            const result = await client.query<{
                id: number;
            }>(`
                    INSERT INTO categories (name, slug, description, is_active)
                    VALUES ($1, $2, $3, TRUE)
                    ON CONFLICT (slug) DO UPDATE
                    SET name = EXCLUDED.name,
                        description = EXCLUDED.description
                    RETURNING id
                `, [category.name, category.slug, category.description]);
            categoryIds.set(category.slug, result.rows[0].id);
        }
        await client.query("UPDATE products SET is_active = FALSE WHERE slug = ANY($1::text[])", [retiredDemoProducts]);
        for (const product of portfolio.products) {
            const categoryId = categoryIds.get(product.categorySlug);
            if (!categoryId) {
                throw new Error(`Categoría no encontrada para ${product.slug}.`);
            }
            const result = await client.query<{
                id: number;
            }>(`
                    INSERT INTO products (name, slug, description, category_id, is_active)
                    VALUES ($1, $2, $3, $4, TRUE)
                    ON CONFLICT (slug) DO UPDATE
                    SET name = EXCLUDED.name,
                        description = EXCLUDED.description,
                        category_id = EXCLUDED.category_id,
                        is_active = TRUE,
                        updated_at = CURRENT_TIMESTAMP
                    RETURNING id
                `, [product.name, product.slug, product.description, categoryId]);
            const productId = result.rows[0].id;
            const existingImage = await client.query<{ storage_key: string }>(`
                    SELECT storage_key
                    FROM stored_files
                    WHERE resource_type = 'products'
                      AND resource_id = $1
                      AND asset_role = 'image'
                      AND slot_key = 'primary'
                      AND is_current = TRUE
                    LIMIT 1
                `, [productId]);
            const currentStorageKey = existingImage.rows[0]?.storage_key;
            if (currentStorageKey && await binaryStorage.exists(currentStorageKey)) {
                continue;
            }
            if (currentStorageKey) {
                await client.query(`
                    UPDATE stored_files
                    SET is_current = FALSE
                    WHERE resource_type = 'products'
                      AND resource_id = $1
                      AND asset_role = 'image'
                      AND slot_key = 'primary'
                      AND is_current = TRUE
                `, [productId]);
            }
            const content = await readFile(join(__dirname, "assets", "portfolio", product.image));
            const stored = await binaryStorage.save({
                key: `products/${productId}/portfolio-${randomUUID()}.png`,
                content,
            });
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
                        is_current
                    )
                    VALUES (
                        'products',
                        $1,
                        'image',
                        'primary',
                        COALESCE((
                            SELECT MAX(version) + 1
                            FROM stored_files
                            WHERE resource_type = 'products'
                              AND resource_id = $1
                              AND asset_role = 'image'
                              AND slot_key = 'primary'
                        ), 1),
                        $2, $3, 'image/png', $4, $5, TRUE
                    )
                `, [productId, stored.key, product.image, stored.sizeBytes, stored.sha256]);
        }
        await client.query(`
                UPDATE categories
                SET is_active = FALSE
                WHERE slug = ANY($1::text[])
                  AND NOT EXISTS (
                      SELECT 1
                      FROM products
                      WHERE category_id = categories.id
                        AND is_active = TRUE
                  )
            `, [["metrologia", "consultoria", "auditoria"]]);
        await client.query("COMMIT");
        console.log(`Portafolio listo: ${portfolio.products.length} productos y ${portfolio.categories.length} categorías.`);
    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
}
