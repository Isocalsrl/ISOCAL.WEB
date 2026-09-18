const { cpSync, existsSync, mkdirSync } = require("node:fs");

function copyDirectory(source, target) {
  if (!existsSync(source)) return;
  mkdirSync(target, { recursive: true });
  cpSync(source, target, { recursive: true });
}

copyDirectory("src/database/migrations", "dist/database/migrations");
copyDirectory("src/database/seeds/assets", "dist/database/seeds/assets");
copyDirectory("src/modules/requests/documents/assets", "dist/modules/requests/documents/assets");
copyDirectory("src/modules/quotes/documents/assets", "dist/modules/quotes/documents/assets");
