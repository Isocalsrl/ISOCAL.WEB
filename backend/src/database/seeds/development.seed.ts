import { seedConfiguredSuperAdmin } from "../../modules/auth/auth.seed.js";
import { seedBlog } from "./blog.seed.js";
import { seedPortfolio } from "./portfolio.seed.js";

export async function runContentSeeds(): Promise<void> {
    await seedPortfolio();
    await seedBlog();
}

export async function runDevelopmentSeeds(): Promise<void> {
    const result = await seedConfiguredSuperAdmin();
    if (result === "created") {
        console.log("Superadministrador inicial creado desde el .env raíz.");
    } else if (result === "already-exists") {
        console.log("Superadministrador inicial listo.");
    } else {
        console.warn("Superadministrador inicial omitido: faltan variables BOOTSTRAP_SUPER_ADMIN_*.");
    }

    await runContentSeeds();
}
