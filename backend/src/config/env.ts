import "dotenv/config"

export const env = {
    port: Number(process.env.PORT ?? 3000),
    databaseUrl: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5433/isocal",
    jwtSecret: process.env.JWT_SECRET ?? "your-secret-key",
    jwtExpiration: process.env.JWT_EXPIRATION ?? "24h",
}