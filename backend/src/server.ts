import type { Server } from "node:http";
import app from "./app.js";
import { env } from "./config/env.js";
import { db } from "./database/db.js";
import { prepareApplication } from "./startup/prepareApplication.js";

let server: Server | null = null;
let isShuttingDown = false;

async function start(): Promise<void> {
    try {
        await prepareApplication();
        server = app.listen(env.port, () => {
            console.log(`API corriendo en el puerto ${env.port}`);
        });
    } catch (error) {
        console.error("No se pudo iniciar ISOCAL.", error);
        await db.end().catch(() => undefined);
        process.exit(1);
    }
}

async function shutdown(signal: NodeJS.Signals): Promise<void> {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`${signal} recibido. Cerrando API...`);

    const closeDatabaseAndExit = async (): Promise<void> => {
        await db.end().catch((error) => {
            console.error("No se pudo cerrar el pool de base de datos limpiamente.", error);
        });
        process.exit(0);
    };

    if (!server) {
        await closeDatabaseAndExit();
        return;
    }

    server.close(() => {
        void closeDatabaseAndExit();
    });

    setTimeout(() => {
        console.error("Cierre forzado: la API no terminó dentro del tiempo esperado.");
        process.exit(1);
    }, 10000).unref();
}

process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});

process.on("SIGINT", () => {
    void shutdown("SIGINT");
});

void start();
