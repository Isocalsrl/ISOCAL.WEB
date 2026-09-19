import { spawnSync } from "node:child_process";

function run(args, { allowFailure = false } = {}) {
    const result = spawnSync("docker", args, { stdio: "inherit", windowsHide: true });
    if (!allowFailure && (result.error || result.status !== 0)) {
        throw result.error ?? new Error(`docker ${args.join(" ")} terminó con código ${result.status}.`);
    }
}

// Reinicia únicamente MariaDB/MySQL. El volumen backend_storage se conserva para no borrar imágenes/PDF.
run(["compose", "stop", "mysql"], { allowFailure: true });
run(["compose", "rm", "-f", "mysql"], { allowFailure: true });
run(["volume", "rm", "isocal_mysql_data"], { allowFailure: true });
console.log("Base de datos MariaDB/MySQL reiniciada. El almacenamiento de archivos se conservó.");
