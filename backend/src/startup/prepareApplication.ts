import { db } from "../database/db.js";
import { runMigrations } from "../database/migrationRunner.js";
import { runContentSeeds } from "../database/seeds/development.seed.js";
import { seedConfiguredSuperAdmin } from "../modules/auth/auth.seed.js";

const initialContentStep = "initial-content-v1";
const initialContentLock = "isocal_initial_content_seed";

async function runPendingMigrations(): Promise<void> {
    const client = await db.connect();
    try {
        await runMigrations(client);
    } finally {
        client.release();
    }
}

async function ensureConfiguredSuperAdmin(): Promise<void> {
    const result = await seedConfiguredSuperAdmin();

    if (result === "created") {
        console.log("Superadministrador inicial creado.");
        return;
    }

    if (result === "already-exists") {
        console.log("Superadministrador inicial listo.");
        return;
    }

    console.warn(
        "Superadministrador inicial omitido: no se configuraron BOOTSTRAP_SUPER_ADMIN_NAME, BOOTSTRAP_SUPER_ADMIN_EMAIL y BOOTSTRAP_SUPER_ADMIN_PASSWORD.",
    );
}

async function ensureInitialContent(): Promise<void> {
    const client = await db.connect();
    let lockAcquired = false;

    try {
        const lock = await client.query<{ acquired: number }>(
            "SELECT GET_LOCK($1, 30) AS acquired",
            [initialContentLock],
        );
        lockAcquired = Number(lock.rows[0]?.acquired) === 1;

        if (!lockAcquired) {
            throw new Error("No se pudo obtener el bloqueo del bootstrap de contenido.");
        }

        const existing = await client.query<{ step_key: string }>(
            "SELECT step_key FROM app_bootstrap_steps WHERE step_key = $1 LIMIT 1",
            [initialContentStep],
        );

        if (existing.rowCount > 0) {
            console.log("Contenido inicial ya preparado.");
            return;
        }

        await runContentSeeds();
        await client.query(
            "INSERT INTO app_bootstrap_steps (step_key) VALUES ($1)",
            [initialContentStep],
        );
        console.log("Contenido inicial preparado.");
    } finally {
        if (lockAcquired) {
            await client.query("SELECT RELEASE_LOCK($1)", [initialContentLock]).catch(() => undefined);
        }
        client.release();
    }
}

export async function prepareApplication(): Promise<void> {
    await runPendingMigrations();
    await ensureConfiguredSuperAdmin();
    await ensureInitialContent();
    console.log("ISOCAL preparado para iniciar.");
}
