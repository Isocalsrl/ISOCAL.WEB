import { db } from "../db.js";
import { seedPortfolio } from "../seeds/portfolio.seed.js";
seedPortfolio()
    .catch((error) => {
    console.error("No se pudo cargar el portafolio.", error);
    process.exitCode = 1;
})
    .finally(() => db.end());
