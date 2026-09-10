import { db } from "./db.js";
import { runMigrations } from "./scripts/migration-runner.js";
import { runSeeds } from "./scripts/seed.js";

async function initializeDatabase() {
    const client = await db.connect();

    try {
        await runMigrations(client);
        await runSeeds();
        console.log("Base de datos inicializada correctamente.");
    } finally {
        client.release();
        await db.end();
    }
}

initializeDatabase().catch((error) => {
    console.error("No se pudo inicializar la base de datos.", error);
    process.exitCode = 1;
});
