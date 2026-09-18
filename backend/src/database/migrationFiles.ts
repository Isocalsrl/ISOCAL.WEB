import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
export type Migration = {
    filename: string;
    sql: string;
};
const migrationsDirectory = resolve(__dirname, "migrations");
export async function getMigrationFiles(): Promise<Migration[]> {
    const filenames = (await readdir(migrationsDirectory))
        .filter((filename) => filename.endsWith(".sql"))
        .sort();
    return Promise.all(filenames.map(async (filename) => ({
        filename,
        sql: await readFile(resolve(migrationsDirectory, filename), "utf8"),
    })));
}
