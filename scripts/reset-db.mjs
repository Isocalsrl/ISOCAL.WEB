import { spawnSync } from "node:child_process";

function run(args, { allowFailure = false } = {}) {
    const result = spawnSync("docker", args, { stdio: "inherit", windowsHide: true });
    if (!allowFailure && (result.error || result.status !== 0)) {
        throw result.error ?? new Error(`docker ${args.join(" ")} terminó con código ${result.status}.`);
    }
}

// Reinicia únicamente PostgreSQL. El volumen backend_storage se conserva para no borrar imágenes/PDF.
run(["compose", "stop", "postgres"], { allowFailure: true });
run(["compose", "rm", "-f", "postgres"], { allowFailure: true });
run(["volume", "rm", "isocal_postgres_data"], { allowFailure: true });
console.log("Base de datos PostgreSQL reiniciada. El almacenamiento de archivos se conservó.");
