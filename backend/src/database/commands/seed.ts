import { env } from "../../config/env.js";
import { db } from "../db.js";
import { runContentSeeds, runDevelopmentSeeds } from "../seeds/development.seed.js";

const seed = env.nodeEnv === "production" ? runContentSeeds : runDevelopmentSeeds;

seed()
    .catch((error) => {
        console.error("No se pudieron ejecutar los seeds.", error);
        process.exitCode = 1;
    })
    .finally(() => db.end());
