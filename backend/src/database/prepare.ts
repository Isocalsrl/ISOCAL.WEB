import { env } from "../config/env.js";
import { seedAdmin } from "../modules/auth/services/auth.seed.service.js";
import { db } from "./db.js";
import { runMigrations } from "./scripts/migration-runner.js";

async function runMigrationsForDeployment(): Promise<void> {
    const client = await db.connect();

    try {
        await runMigrations(client);
    } finally {
        client.release();
    }
}

async function bootstrapSuperAdmin(): Promise<void> {
    const values = [
        env.bootstrapAdminName,
        env.bootstrapAdminEmail,
        env.bootstrapAdminPassword,
    ];
    const configuredValues = values.filter(Boolean).length;

    if (configuredValues === 0) {
        console.log("Bootstrap de super_admin omitido: no se configuraron credenciales iniciales.");
        return;
    }

    if (configuredValues !== values.length) {
        throw new Error(
            "BOOTSTRAP_ADMIN_NAME, BOOTSTRAP_ADMIN_EMAIL y BOOTSTRAP_ADMIN_PASSWORD deben configurarse juntos.",
        );
    }

    const result = await seedAdmin({
        name: env.bootstrapAdminName!,
        email: env.bootstrapAdminEmail!,
        password: env.bootstrapAdminPassword!,
        role: "super_admin",
    });

    console.log(
        result === "created"
            ? "Super administrador inicial creado correctamente."
            : "Bootstrap omitido: el administrador inicial ya existe.",
    );
}

async function prepareDeployment(): Promise<void> {
    try {
        await runMigrationsForDeployment();
        await bootstrapSuperAdmin();
        console.log("Base de datos preparada para iniciar la aplicación.");
    } finally {
        await db.end();
    }
}

prepareDeployment().catch((error) => {
    console.error("No se pudo preparar la base de datos para el despliegue.", error);
    process.exitCode = 1;
});
