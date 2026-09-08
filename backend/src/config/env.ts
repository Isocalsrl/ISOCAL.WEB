import "dotenv/config"

export const env = {
    port: Number(process.env.PORT ?? 3000),
    databaseUrl: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5433/isocal",
}