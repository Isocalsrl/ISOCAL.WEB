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

const retiredDemoCategories = ["metrologia", "consultoria", "auditoria"];
const portfolioLock = "isocal_portfolio_seed";

export async function seedPortfolio(): Promise<void> {
    const client = await db.connect();
    let lockAcquired = false;
    try {
        const lock = await client.query<{ acquired: number }>("SELECT GET_LOCK($1, 30) AS acquired", [portfolioLock]);
        lockAcquired = Number(lock.rows[0]?.acquired) === 1;
        if (!lockAcquired) throw new Error("No se pudo bloquear el seed de portafolio.");

        await client.query("START TRANSACTION");
        const categoryIds = new Map<string, number>();

        for (const category of portfolio.categories) {
            const existing = await client.query<{ id: number }>(
                "SELECT id FROM categories WHERE slug = $1 LIMIT 1",
                [category.slug],
            );

            let categoryId = existing.rows[0]?.id;
            if (categoryId) {
                await client.query(`
                    UPDATE categories
                    SET name = $2,
                        description = $3,
                        is_active = TRUE,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = $1
                `, [categoryId, category.name, category.description]);
            } else {
                const inserted = await client.query(`
                    INSERT INTO categories (name, slug, description, is_active)
                    VALUES ($1, $2, $3, TRUE)
                `, [category.name, category.slug, category.description]);
                categoryId = inserted.insertId;
            }

            categoryIds.set(category.slug, categoryId);
        }

        await client.query("UPDATE products SET is_active = FALSE WHERE slug IN ($1)", [retiredDemoProducts]);

        for (const product of portfolio.products) {
            const categoryId = categoryIds.get(product.categorySlug);
            if (!categoryId) throw new Error(`Categoría no encontrada para ${product.slug}.`);

            const result = await client.query(`
                INSERT INTO products (name, slug, description, category_id, is_active)
                VALUES ($1, $2, $3, $4, TRUE)
                ON DUPLICATE KEY UPDATE
                    id = LAST_INSERT_ID(id),
                    name = VALUES(name),
                    description = VALUES(description),
                    category_id = VALUES(category_id),
                    is_active = TRUE,
                    updated_at = CURRENT_TIMESTAMP
            `, [product.name, product.slug, product.description, categoryId]);
            const productId = result.insertId;

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
            if (currentStorageKey && await binaryStorage.exists(currentStorageKey)) continue;

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
                        SELECT MAX(existing.version) + 1
                        FROM stored_files AS existing
                        WHERE existing.resource_type = 'products'
                          AND existing.resource_id = $1
                          AND existing.asset_role = 'image'
                          AND existing.slot_key = 'primary'
                    ), 1),
                    $2, $3, 'image/png', $4, $5, TRUE
                )
            `, [productId, stored.key, product.image, stored.sizeBytes, stored.sha256]);
        }

        await client.query(`
            UPDATE categories
            SET is_active = FALSE,
                updated_at = CURRENT_TIMESTAMP
            WHERE slug IN ($1)
              AND NOT EXISTS (
                  SELECT 1
                  FROM products
                  WHERE category_id = categories.id
                    AND is_active = TRUE
              )
        `, [retiredDemoCategories]);

        await client.query("COMMIT");
        console.log(`Portafolio listo: ${portfolio.products.length} productos y ${portfolio.categories.length} categorías.`);
    } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw error;
    } finally {
        if (lockAcquired) {
            await client.query("SELECT RELEASE_LOCK($1)", [portfolioLock]).catch(() => undefined);
        }
        client.release();
    }
}
