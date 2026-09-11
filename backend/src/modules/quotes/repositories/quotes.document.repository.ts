import type { PoolClient } from "pg";
import { db } from "../../../database/db.js";
import { insertQuoteEvent } from "./quotes.events.repository.js";
import type { QuoteDocument } from "../quoteDocument.types.js";

interface StoredFileRow { id: string | number; resource_id: string | number; version: number; storage_key: string; file_name: string; mime_type: string; file_size_bytes: string | number; sha256: string; is_current: boolean; created_by: number | null; created_at: Date; }
function toDocument(row: StoredFileRow): QuoteDocument { return { id: Number(row.id), quoteId: Number(row.resource_id), version: row.version, storageKey: row.storage_key, fileName: row.file_name, mimeType: row.mime_type, fileSizeBytes: Number(row.file_size_bytes), sha256: row.sha256, isCurrent: row.is_current, generatedBy: row.created_by, generatedAt: row.created_at }; }

export interface SavePreparedDocumentInput { quoteId: number; generatedBy: number; generatedAt: Date; storageKey: string; fileName: string; mimeType: string; fileSizeBytes: number; sha256: string; }

export async function savePreparedQuoteDocument(input: SavePreparedDocumentInput): Promise<QuoteDocument | null> {
    const client = await db.connect();
    try {
        await client.query("BEGIN");
        const quote = await client.query<{ status: string }>("SELECT status FROM quotes WHERE id = $1 FOR UPDATE", [input.quoteId]);
        if (quote.rows[0]?.status !== "priced") { await client.query("ROLLBACK"); return null; }
        const versionResult = await client.query<{ version: number }>("SELECT (COALESCE(MAX(version), 0) + 1)::integer AS version FROM stored_files WHERE resource_type = 'quotes' AND resource_id = $1 AND asset_role = 'document' AND slot_key = 'default'", [input.quoteId]);
        const version = versionResult.rows[0].version;
        await client.query("UPDATE stored_files SET is_current = FALSE WHERE resource_type = 'quotes' AND resource_id = $1 AND asset_role = 'document' AND slot_key = 'default' AND is_current = TRUE", [input.quoteId]);
        const result = await client.query<StoredFileRow>(
            `INSERT INTO stored_files (resource_type, resource_id, asset_role, slot_key, version, storage_key, file_name, mime_type, file_size_bytes, sha256, is_current, created_by, created_at) VALUES ('quotes', $1, 'document', 'default', $2, $3, $4, $5, $6, $7, TRUE, $8, $9) RETURNING id, resource_id, version, storage_key, file_name, mime_type, file_size_bytes, sha256, is_current, created_by, created_at`,
            [input.quoteId, version, input.storageKey, input.fileName, input.mimeType, input.fileSizeBytes, input.sha256, input.generatedBy, input.generatedAt],
        );
        await client.query("UPDATE quotes SET status = 'ready_to_send', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [input.quoteId]);
        await insertQuoteEvent(client, { quoteId: input.quoteId, actorAdminId: input.generatedBy, eventType: "document_generated", fromStatus: "priced", toStatus: "ready_to_send", note: `PDF versión ${version} generado.` });
        await client.query("COMMIT");
        return toDocument(result.rows[0]);
    } catch (error) { await client.query("ROLLBACK"); throw error; } finally { client.release(); }
}

export async function findCurrentQuoteDocument(quoteId: number): Promise<QuoteDocument | null> {
    const result = await db.query<StoredFileRow>(
        "SELECT id, resource_id, version, storage_key, file_name, mime_type, file_size_bytes, sha256, is_current, created_by, created_at FROM stored_files WHERE resource_type = 'quotes' AND resource_id = $1 AND asset_role = 'document' AND slot_key = 'default' AND is_current = TRUE LIMIT 1",
        [quoteId],
    );
    return result.rows[0] ? toDocument(result.rows[0]) : null;
}

export async function invalidateCurrentQuoteDocument(client: PoolClient, quoteId: number): Promise<void> {
    await client.query("UPDATE stored_files SET is_current = FALSE WHERE resource_type = 'quotes' AND resource_id = $1 AND asset_role = 'document' AND slot_key = 'default' AND is_current = TRUE", [quoteId]);
}
