import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workspaces = ["@isocal/backend", "@isocal/frontend"];
const isWindows = process.platform === "win32";
const command = isWindows ? (process.env.ComSpec || "cmd.exe") : "npm";

function commandArgs(workspace) {
    if (!isWindows) return ["run", "dev", "-w", workspace];
    return ["/d", "/s", "/c", `npm run dev -w ${workspace}`];
}

const children = workspaces.map((workspace) => {
    const child = spawn(command, commandArgs(workspace), {
        cwd: repositoryRoot,
        stdio: "inherit",
        windowsHide: true,
    });

    child.once("error", (error) => {
        console.error(`No se pudo iniciar ${workspace}.`, error);
        stopAll();
        process.exitCode = 1;
    });

    return child;
});

let stopping = false;

function stopAll(signal = "SIGTERM") {
    if (stopping) return;
    stopping = true;

    for (const child of children) {
        if (!child.killed) child.kill(signal);
    }
}

for (const child of children) {
    child.once("exit", (code, signal) => {
        if (stopping || (code === 0 && !signal)) return;
        stopAll();
        process.exitCode = code ?? 1;
    });
}

process.once("SIGINT", () => stopAll("SIGINT"));
process.once("SIGTERM", () => stopAll("SIGTERM"));
