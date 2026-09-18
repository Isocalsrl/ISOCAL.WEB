import { Pool } from "pg";
import { env } from "../config/env.js";

export const db = new Pool({
    host: env.database.host,
    port: env.database.port,
    user: env.database.user,
    password: env.database.password,
    database: env.database.name,
    ssl: env.database.ssl ? { rejectUnauthorized: false } : false,
});
