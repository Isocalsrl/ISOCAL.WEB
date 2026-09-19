import { db, type DatabaseConnection } from "./db.js";

export async function withTransaction<T>(callback: (client: DatabaseConnection) => Promise<T>): Promise<T> {
    const client = await db.connect();
    try {
        await client.query("START TRANSACTION");
        const result = await callback(client);
        await client.query("COMMIT");
        return result;
    } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        throw error;
    } finally {
        client.release();
    }
}
