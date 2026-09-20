import { access, readdir } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const requiredFiles = [
    "backend/dist/server.js",
    "backend/dist/public/index.html",
];

for (const relativePath of requiredFiles) {
    const absolutePath = resolve(root, relativePath);
    try {
        await access(absolutePath, constants.R_OK);
    } catch {
        throw new Error(`Build de producción incompleto: falta ${relativePath}.`);
    }
}

const migrationsDirectory = resolve(root, "backend/dist/database/migrations");
const migrationFiles = (await readdir(migrationsDirectory)).filter((file) => file.endsWith(".sql"));

if (migrationFiles.length === 0) {
    throw new Error("Build de producción incompleto: no se copiaron las migraciones SQL.");
}

console.log(
    `Build de producción verificado: servidor, frontend y ${migrationFiles.length} migraciones listos.`,
);
