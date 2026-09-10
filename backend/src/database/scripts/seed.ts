import { db } from "../db.js";
import { seedAdmin } from "../../modules/auth/services/auth.seed.service.js";

const TEST_ADMIN = {
    name: "Administrador Isocal",
    email: "admin@isocal.com",
    password: "Admin123!",
    role: "super_admin" as const,
};

export async function runSeeds(): Promise<void> {
    const result = await seedAdmin(TEST_ADMIN);

    console.log(
        result === "created"
            ? "Administrador inicial creado."
            : "Seed de administrador omitido: el correo ya existe.",
    );
}

async function execute(): Promise<void> {
    try {
        await runSeeds();
    } finally {
        await db.end();
    }
}

if (require.main === module) {
    execute().catch((error) => {
        console.error("No se pudieron ejecutar los seeds.", error);
        process.exitCode = 1;
    });
}
