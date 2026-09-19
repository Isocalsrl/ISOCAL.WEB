import { readFile, readdir } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";

const root = process.cwd();
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".mjs"]);
const importPattern = /(?:from\s+["']|import\s*["'])([^"']+)["']/g;
const violations = [];

async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const path = resolve(directory, entry.name);
        if (entry.isDirectory()) files.push(...await walk(path));
        else files.push(path);
    }
    return files;
}

function normalized(path) {
    return path.split(sep).join("/");
}

function moduleName(path, marker) {
    const value = normalized(path);
    const index = value.indexOf(marker);
    if (index < 0) return null;
    return value.slice(index + marker.length).split("/")[0] ?? null;
}

function addViolation(file, message) {
    violations.push(`${normalized(relative(root, file))}: ${message}`);
}

async function inspectImports(baseDirectory, kind) {
    const files = (await walk(baseDirectory)).filter((file) => sourceExtensions.has(extname(file)));
    for (const file of files) {
        const source = await readFile(file, "utf8");
        for (const match of source.matchAll(importPattern)) {
            const specifier = match[1];
            if (!specifier.startsWith(".")) continue;
            const target = resolve(file, "..", specifier);
            const sourcePath = normalized(file);
            const targetPath = normalized(target);

            if (kind === "frontend") {
                if (sourcePath.includes("/frontend/src/shared/") && (targetPath.includes("/frontend/src/features/") || targetPath.includes("/frontend/src/app/"))) {
                    addViolation(file, `shared no puede depender de ${specifier}`);
                }
                if (sourcePath.includes("/frontend/src/features/") && targetPath.includes("/frontend/src/app/")) {
                    addViolation(file, `una feature no puede depender de app (${specifier})`);
                }
            }

            if (kind === "backend") {
                if (sourcePath.includes("/backend/src/shared/") && targetPath.includes("/backend/src/modules/")) {
                    addViolation(file, `shared no puede depender de un módulo (${specifier})`);
                }
                const sourceModule = moduleName(file, "/backend/src/modules/");
                const targetModule = moduleName(target, "/backend/src/modules/");
                const isInternalBoundaryFile = /\.(repository|mapper|types|validation)\.ts$/.test(sourcePath);
                if (sourceModule && targetModule && sourceModule !== targetModule && isInternalBoundaryFile) {
                    addViolation(file, `${sourcePath.split("/").pop()} no puede importar internals de ${targetModule}; usa su service o mueve el contrato a shared`);
                }
            }
        }
    }
}

async function inspectStyles() {
    const stylesRoot = resolve(root, "frontend/src");
    const files = await walk(stylesRoot);
    for (const file of files) {
        if (extname(file) !== ".css") continue;
        const name = normalized(file).split("/").pop().toLowerCase();
        if (/(override|polish)/.test(name)) {
            addViolation(file, "el nombre del stylesheet describe una corrección temporal; nómbralo por responsabilidad");
        }
    }
}

await Promise.all([
    inspectImports(resolve(root, "frontend/src"), "frontend"),
    inspectImports(resolve(root, "backend/src"), "backend"),
    inspectStyles(),
]);

if (violations.length > 0) {
    console.error("\nFronteras de arquitectura incumplidas:\n");
    for (const violation of violations) console.error(`- ${violation}`);
    process.exit(1);
}

console.log("Arquitectura: fronteras principales verificadas.");
