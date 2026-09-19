import mysql, { type PoolConnection, type ResultSetHeader } from "mysql2/promise";
import { env } from "../config/env.js";

export interface DatabaseQueryResult<T> {
    rows: T[];
    rowCount: number;
    insertId: number;
}

export interface DatabaseQueryable {
    query<T = Record<string, unknown>>(sql: string, values?: readonly unknown[]): Promise<DatabaseQueryResult<T>>;
}

function compileQuery(sql: string, values: readonly unknown[] = []): { sql: string; values: unknown[] } {
    if (!/\$\d+/.test(sql)) {
        return { sql, values: [...values] };
    }

    const compiledValues: unknown[] = [];
    const compiledSql = sql.replace(/\$(\d+)/g, (_match, rawIndex: string) => {
        const index = Number(rawIndex) - 1;
        if (index < 0 || index >= values.length) {
            throw new Error(`Parámetro SQL $${rawIndex} fuera de rango.`);
        }
        compiledValues.push(values[index]);
        return "?";
    });

    return { sql: compiledSql, values: compiledValues };
}

async function runQuery<T>(
    queryable: Pick<PoolConnection, "query">,
    sql: string,
    values: readonly unknown[] = [],
): Promise<DatabaseQueryResult<T>> {
    const compiled = compileQuery(sql, values);
    const [result] = await queryable.query(compiled.sql, compiled.values);

    if (Array.isArray(result)) {
        const rows = result as unknown as T[];
        return { rows, rowCount: rows.length, insertId: 0 };
    }

    const header = result as ResultSetHeader;
    return {
        rows: [],
        rowCount: header.affectedRows ?? 0,
        insertId: Number(header.insertId ?? 0),
    };
}

const pool = mysql.createPool({
    host: env.database.host,
    port: env.database.port,
    user: env.database.user,
    password: env.database.password,
    database: env.database.name,
    ssl: env.database.ssl ? { rejectUnauthorized: false } : undefined,
    waitForConnections: true,
    connectionLimit: env.database.connectionLimit,
    queueLimit: 0,
    enableKeepAlive: true,
    charset: "utf8mb4",
    timezone: "Z",
    supportBigNumbers: true,
    bigNumberStrings: false,
});

const initializedConnections = new WeakSet<object>();

async function initializeConnection(connection: PoolConnection): Promise<void> {
    if (initializedConnections.has(connection)) return;
    await connection.query("SET SESSION time_zone = '+00:00'");
    initializedConnections.add(connection);
}

export class DatabaseConnection implements DatabaseQueryable {
    constructor(private readonly connection: PoolConnection) {}

    query<T = Record<string, unknown>>(sql: string, values: readonly unknown[] = []): Promise<DatabaseQueryResult<T>> {
        return runQuery<T>(this.connection, sql, values);
    }

    release(): void {
        this.connection.release();
    }
}

class DatabasePool implements DatabaseQueryable {
    async query<T = Record<string, unknown>>(sql: string, values: readonly unknown[] = []): Promise<DatabaseQueryResult<T>> {
        const connection = await pool.getConnection();
        try {
            await initializeConnection(connection);
            return await runQuery<T>(connection, sql, values);
        } finally {
            connection.release();
        }
    }

    async connect(): Promise<DatabaseConnection> {
        const connection = await pool.getConnection();
        try {
            await initializeConnection(connection);
            return new DatabaseConnection(connection);
        } catch (error) {
            connection.release();
            throw error;
        }
    }

    async end(): Promise<void> {
        await pool.end();
    }
}

export const db = new DatabasePool();
