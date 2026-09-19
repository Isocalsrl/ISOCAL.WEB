const { spawnSync } = require("node:child_process");

function run(script) {
    const result = spawnSync(process.execPath, [script], {
        stdio: "inherit",
        env: process.env,
    });

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        process.exit(result.status ?? 1);
    }
}

run("./backend/dist/database/commands/prepare-deployment.js");
run("./backend/dist/database/commands/seed.js");

require("./backend/dist/server.js");
