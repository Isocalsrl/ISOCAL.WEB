import type { DatabaseConnection } from "./db.js";
import { getMigrationFiles, type Migration } from "./migrationFiles.js";

const migrationLock = "isocal_database_migrations";
const legacyMigrationNames: Record<string, readonly string[]> = {
    "004_create_admin.sql": ["003_create_admin.sql"],
    "005_create_admin_login_events.sql": ["006_create_admin_login_events.sql"],
    "005_create_admin_sessions.sql": ["004_create_admin_sessions.sql"],
};

async function createMigrationsTable(client: DatabaseConnection): Promise<void> {
    await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            filename VARCHAR(255) PRIMARY KEY,
            applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
}

async function migrationWasApplied(client: DatabaseConnection, filename: string): Promise<boolean> {
    const result = await client.query("SELECT 1 FROM schema_migrations WHERE filename = $1 LIMIT 1", [filename]);
    return result.rowCount > 0;
}

async function reconcileLegacyMigration(client: DatabaseConnection, filename: string): Promise<string | null> {
    const legacyNames = legacyMigrationNames[filename] ?? [];
    if (legacyNames.length === 0) return null;

    const result = await client.query<{ filename: string }>(`
        SELECT filename
        FROM schema_migrations
        WHERE filename IN ($1)
        ORDER BY applied_at ASC
        LIMIT 1
    `, [legacyNames]);

    const legacyFilename = result.rows[0]?.filename;
    if (!legacyFilename) return null;

    await client.query("INSERT IGNORE INTO schema_migrations (filename) VALUES ($1)", [filename]);
    return legacyFilename;
}

function statementsOf(sql: string): string[] {
    return sql
        .split(";")
        .map((statement) => statement.trim())
        .filter(Boolean);
}

async function applyMigration(client: DatabaseConnection, migration: Migration): Promise<void> {
    for (const statement of statementsOf(migration.sql)) {
        await client.query(statement);
    }
    await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [migration.filename]);
}

export async function runMigrations(client: DatabaseConnection): Promise<void> {
    await createMigrationsTable(client);

    const lock = await client.query<{ acquired: number }>("SELECT GET_LOCK($1, 30) AS acquired", [migrationLock]);
    if (Number(lock.rows[0]?.acquired) !== 1) {
        throw new Error("No se pudo obtener el bloqueo de migraciones de MariaDB/MySQL.");
    }

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
    } finally {
        await client.query("SELECT RELEASE_LOCK($1)", [migrationLock]).catch(() => undefined);
    }
}
