import type { PoolClient } from "pg";
import { getMigrationFiles, type Migration } from "./migrationFiles.js";
const migrationLock = "isocal_database_migrations";
const legacyMigrationNames: Record<string, readonly string[]> = {
    "004_create_admin.sql": ["003_create_admin.sql"],
    "005_create_admin_login_events.sql": ["006_create_admin_login_events.sql"],
    "005_create_admin_sessions.sql": ["004_create_admin_sessions.sql"],
};
async function createMigrationsTable(client: PoolClient) {
    await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            filename TEXT PRIMARY KEY,
            applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `);
}
async function migrationWasApplied(client: PoolClient, filename: string) {
    const result = await client.query("SELECT 1 FROM schema_migrations WHERE filename = $1", [filename]);
    return Boolean(result.rowCount);
}
async function reconcileLegacyMigration(client: PoolClient, filename: string): Promise<string | null> {
    const legacyNames = legacyMigrationNames[filename] ?? [];
    if (legacyNames.length === 0) {
        return null;
    }
    const result = await client.query<{
        filename: string;
    }>(`
            SELECT filename
            FROM schema_migrations
            WHERE filename = ANY($1::text[])
            ORDER BY applied_at ASC
            LIMIT 1
        `, [legacyNames]);
    const legacyFilename = result.rows[0]?.filename;
    if (!legacyFilename) {
        return null;
    }
    await client.query(`
            INSERT INTO schema_migrations (filename)
            VALUES ($1)
            ON CONFLICT (filename) DO NOTHING
        `, [filename]);
    return legacyFilename;
}
async function applyMigration(client: PoolClient, migration: Migration) {
    await client.query("BEGIN");
    try {
        await client.query(migration.sql);
        await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [migration.filename]);
        await client.query("COMMIT");
    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
}
export async function runMigrations(client: PoolClient) {
    await createMigrationsTable(client);
    await client.query("SELECT pg_advisory_lock(hashtext($1))", [migrationLock]);
    try {
        const migrations = await getMigrationFiles();
        for (const migration of migrations) {
            if (await migrationWasApplied(client, migration.filename)) {
                console.log(`Migración omitida: ${migration.filename}`);
                continue;
            }
            const legacyFilename = await reconcileLegacyMigration(client, migration.filename);
            if (legacyFilename) {
                console.log(`Legacy migration reconciled: ${migration.filename} (${legacyFilename})`);
                continue;
            }
            await applyMigration(client, migration);
            console.log(`Migración aplicada: ${migration.filename}`);
        }
    }
    finally {
        await client.query("SELECT pg_advisory_unlock(hashtext($1))", [migrationLock]);
    }
}
