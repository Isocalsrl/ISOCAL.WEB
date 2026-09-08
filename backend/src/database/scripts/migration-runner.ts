import type { PoolClient } from "pg";
import { getMigrationFiles, type Migration } from "./migration-files.js";

const migrationLock = "isocal_database_migrations";

async function createMigrationsTable(client: PoolClient) {
    await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            filename TEXT PRIMARY KEY,
            applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

async function migrationWasApplied(client: PoolClient, filename: string) {
    const result = await client.query(
        "SELECT 1 FROM schema_migrations WHERE filename = $1",
        [filename],
    );

    return Boolean(result.rowCount);
}

async function applyMigration(client: PoolClient, migration: Migration) {
    await client.query("BEGIN");

    try {
        await client.query(migration.sql);
        await client.query(
            "INSERT INTO schema_migrations (filename) VALUES ($1)",
            [migration.filename],
        );
        await client.query("COMMIT");
    } catch (error) {
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

            await applyMigration(client, migration);
            console.log(`Migración aplicada: ${migration.filename}`);
        }
    } finally {
        await client.query("SELECT pg_advisory_unlock(hashtext($1))", [migrationLock]);
    }
}
