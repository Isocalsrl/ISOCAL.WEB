import { seedConfiguredSuperAdmin } from "../../modules/auth/auth.seed.js";
import { db } from "../db.js";
import { runMigrations } from "../migrationRunner.js";

async function migrate(): Promise<void> {
    const client = await db.connect();
    try {
        await runMigrations(client);
    } finally {
        client.release();
    }
}

async function prepareDeployment(): Promise<void> {
    try {
        await migrate();
        const result = await seedConfiguredSuperAdmin();
        if (result === "skipped") {
            throw new Error(
                "No se configuraron BOOTSTRAP_SUPER_ADMIN_NAME, BOOTSTRAP_SUPER_ADMIN_EMAIL y BOOTSTRAP_SUPER_ADMIN_PASSWORD.",
            );
        }
        console.log(
            result === "created"
                ? "Superadministrador inicial creado."
                : "Superadministrador inicial ya existente.",
        );
        console.log("Base de datos preparada para iniciar la aplicación.");
    } finally {
        await db.end();
    }
}

prepareDeployment().catch((error) => {
    console.error("No se pudo preparar la base de datos para despliegue.", error);
    process.exitCode = 1;
});
