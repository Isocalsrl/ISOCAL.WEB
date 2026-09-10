import "dotenv/config";

function positiveNumber(
    value: string | undefined,
    fallback: number,
): number {
    const parsedValue = Number(value);

    return Number.isFinite(parsedValue) &&
        parsedValue > 0
        ? parsedValue
        : fallback;
}

export const env = {
    nodeEnv:
        process.env.NODE_ENV ??
        "development",

    port: positiveNumber(
        process.env.PORT,
        3000,
    ),

    databaseUrl:
        process.env.DATABASE_URL ??
        "postgresql://postgres:postgres@localhost:5433/isocal",

    frontendOrigin:
        process.env.FRONTEND_ORIGIN ??
        "http://localhost:5173",

    adminSessionDurationHours:
        positiveNumber(
            process.env
                .ADMIN_SESSION_DURATION_HOURS,
            12,
        ),
};
