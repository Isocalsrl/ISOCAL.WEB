import type { PoolClient } from "pg";
import { db } from "../../../database/db.js";
import type { ProductImageAsset } from "../products.types.js";

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

function mapImage(row: ProductImageRow): ProductImageAsset {
    return {
        storageKey: row.storage_key,
        fileName: row.file_name,
        mimeType: row.mime_type,
        fileSizeBytes: Number(row.file_size_bytes),
        sha256: row.sha256,
        version: row.version,
    };
}

const CURRENT_IMAGE_WHERE = `
    resource_type = 'products'
    AND resource_id = $1
    AND asset_role = 'image'
    AND slot_key = 'primary'
    AND is_current = TRUE
`;

export async function findCurrentProductImage(productId: number): Promise<ProductImageAsset | null> {
    const result = await db.query<ProductImageRow>(
        `SELECT storage_key, file_name, mime_type, file_size_bytes, sha256, version
         FROM stored_files WHERE ${CURRENT_IMAGE_WHERE} LIMIT 1`,
        [productId],
    );
    return result.rows[0] ? mapImage(result.rows[0]) : null;
}

export async function hasCurrentProductImage(client: PoolClient, productId: number): Promise<boolean> {
    const result = await client.query(`SELECT 1 FROM stored_files WHERE ${CURRENT_IMAGE_WHERE} LIMIT 1`, [productId]);
    return Boolean(result.rowCount);
}

export async function replaceCurrentProductImage(
    client: PoolClient,
    input: SaveProductImageInput,
): Promise<number> {
    const current = await client.query<{ version: number }>(
        `SELECT version FROM stored_files WHERE ${CURRENT_IMAGE_WHERE} LIMIT 1 FOR UPDATE`,
        [input.productId],
    );
    const nextVersion = (current.rows[0]?.version ?? 0) + 1;

    await client.query(
        `UPDATE stored_files SET is_current = FALSE WHERE ${CURRENT_IMAGE_WHERE}`,
        [input.productId],
    );

    await client.query(
        `INSERT INTO stored_files (
            resource_type, resource_id, asset_role, slot_key, version,
            storage_key, file_name, mime_type, file_size_bytes, sha256,
            is_current, created_by
        ) VALUES ('products', $1, 'image', 'primary', $2, $3, $4, $5, $6, $7, TRUE, $8)`,
        [input.productId, nextVersion, input.storageKey, input.fileName, input.mimeType, input.fileSizeBytes, input.sha256, input.createdBy],
    );

    return nextVersion;
}
