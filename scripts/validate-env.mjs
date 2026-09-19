import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env");
const forbiddenWorkspaceEnvFiles = [resolve(root, "backend/.env"), resolve(root, "frontend/.env")];

if (!existsSync(envPath)) {
    throw new Error("Falta .env en la raíz del proyecto. Copia .env.example y completa los valores locales.");
}

for (const path of forbiddenWorkspaceEnvFiles) {
    if (existsSync(path)) {
        throw new Error(`Se encontró una configuración duplicada: ${path}. ISOCAL usa únicamente el .env de la raíz.`);
    }
}

const text = readFileSync(envPath, "utf8");
const lines = text.split(/\r?\n/);
const requiredDatabaseKeys = [
    ["DATABASE_HOST", "DB_HOST"],
    ["DATABASE_PORT", "DB_PORT"],
    ["DATABASE_USER", "DB_USER"],
    ["DATABASE_PASSWORD", "DB_PASSWORD"],
    ["DATABASE_NAME", "DB_NAME"],
];
const seen = new Map();

for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index];
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = raw.indexOf("=");
    if (separator <= 0) continue;

    const key = raw.slice(0, separator).trim();
    const value = raw.slice(separator + 1).trim();
    if (!key) continue;

    if (seen.has(key)) {
        throw new Error(`La variable ${key} está repetida en .env (líneas ${seen.get(key)} y ${index + 1}).`);
    }
    seen.set(key, index + 1);

    const isQuoted =
        value.length >= 2 &&
        ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")));

    if (!isQuoted && value.includes("#")) {
        throw new Error(
            `La variable ${key} contiene # sin comillas en .env. Docker Compose y dotenv pueden interpretar valores distintos. Pon el valor completo entre comillas dobles.`,
        );
    }
}

for (const aliases of requiredDatabaseKeys) {
    if (!aliases.some((key) => seen.has(key))) {
        throw new Error(`Falta una de estas variables de base de datos en el .env raíz: ${aliases.join(" o ")}.`);
    }
}

console.log("Configuración raíz validada: una sola fuente de verdad para MariaDB/MySQL.");
