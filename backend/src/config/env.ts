import { resolve } from "node:path";
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

function optionalString(value: string | undefined): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
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

    fileStorageRoot: resolve(
        process.cwd(),
        process.env.FILE_STORAGE_ROOT ?? "storage",
    ),

    resendApiKey: optionalString(process.env.RESEND_API_KEY),
    emailFrom: optionalString(process.env.EMAIL_FROM),
    emailReplyTo: optionalString(process.env.EMAIL_REPLY_TO),
    companyLegalName: optionalString(process.env.ISOCAL_LEGAL_NAME),
    companyRuc: optionalString(process.env.ISOCAL_RUC),
    companyPhone: optionalString(process.env.ISOCAL_PHONE) ?? "+51 991 084 825",
    companyEmail: optionalString(process.env.ISOCAL_EMAIL) ?? "ventas@isocal.pe",
    companyWebsite: optionalString(process.env.ISOCAL_WEBSITE) ?? "https://www.isocal.pe",
    companyAddress: optionalString(process.env.ISOCAL_ADDRESS),
};
