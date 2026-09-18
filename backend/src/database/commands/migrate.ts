import { db } from "../db.js";
import { runMigrations } from "../migrationRunner.js";
async function migrate(): Promise<void> {
    const client = await db.connect();
    try {
        await runMigrations(client);
    }
    finally {
        client.release();
        await db.end();
    }
}
migrate().catch((error) => {
    console.error("No se pudieron aplicar las migraciones.", error);
    process.exitCode = 1;
});
