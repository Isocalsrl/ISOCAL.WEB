import app from "./app.js";
import { env } from "./config/env.js";
import { db } from "./database/db.js";
const server = app.listen(env.port, () => {
    console.log(`API corriendo en el puerto ${env.port}`);
});
let isShuttingDown = false;
async function shutdown(signal: NodeJS.Signals): Promise<void> {
    if (isShuttingDown) {
        return;
    }
    isShuttingDown = true;
    console.log(`${signal} recibido. Cerrando API...`);
    server.close(async () => {
        try {
            await db.end();
        }
        finally {
            process.exit(0);
        }
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
