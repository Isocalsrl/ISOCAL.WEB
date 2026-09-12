import { Pool } from "pg";
import { env } from "../config/env.js";

export const db = new Pool(
    env.databaseUrl
        ? {
              connectionString:
                  env.databaseUrl,
          }
        : undefined,
);
