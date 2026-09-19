import { existsSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { config } from "dotenv";

const repositoryEnvPath = resolve(__dirname, "../../../.env");
if (existsSync(repositoryEnvPath)) {
    // Única fuente local: .env en la raíz. No se cargan archivos .env por workspace.
    // Se respeta process.env para mantener la misma precedencia que Docker Compose.
    config({ path: repositoryEnvPath, quiet: true });
}
const repositoryRoot = dirname(repositoryEnvPath);

function optionalString(value: string | undefined): string | null {
    const normalized = value?.trim();
    return normalized ? normalized : null;
}

function requiredString(value: string | undefined, name: string): string {
    const normalized = optionalString(value);
    if (!normalized) {
        throw new Error(`Falta la variable de entorno requerida ${name}.`);
    }
    return normalized;
}

function positiveInteger(value: string | undefined, fallback: number): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function nonNegativeInteger(value: string | undefined, fallback: number): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
}

function booleanValue(value: string | undefined, fallback: boolean): boolean {
    if (value === undefined) return fallback;
    return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function stringList(value: string | undefined, fallback: readonly string[]): string[] {
    const entries = value
        ?.split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);
    return entries?.length ? entries : [...fallback];
}

function storagePath(value: string | undefined): string {
    const configured = optionalString(value) ?? "backend/storage";
    return isAbsolute(configured) ? configured : resolve(repositoryRoot, configured);
}

export const env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: positiveInteger(process.env.API_HTTP_PORT, 3000),
    webPort: positiveInteger(process.env.WEB_HTTP_PORT, 8080),
    frontendOrigins: stringList(process.env.CORS_ALLOWED_ORIGINS, ["http://localhost:5173"]),
    trustProxyHops: nonNegativeInteger(process.env.TRUST_PROXY_HOPS, 0),
    adminSessionDurationHours: positiveInteger(process.env.ADMIN_SESSION_TTL_HOURS, 12),
    database: {
        host: optionalString(process.env.DATABASE_HOST) ?? optionalString(process.env.DB_HOST) ?? "127.0.0.1",
        port: positiveInteger(process.env.DATABASE_PORT ?? process.env.DB_PORT, 3307),
        user: requiredString(process.env.DATABASE_USER ?? process.env.DB_USER, "DATABASE_USER/DB_USER"),
        password: requiredString(process.env.DATABASE_PASSWORD ?? process.env.DB_PASSWORD, "DATABASE_PASSWORD/DB_PASSWORD"),
        name: requiredString(process.env.DATABASE_NAME ?? process.env.DB_NAME, "DATABASE_NAME/DB_NAME"),
        ssl: booleanValue(process.env.DATABASE_SSL ?? process.env.DB_SSL, false),
        connectionLimit: positiveInteger(process.env.DATABASE_CONNECTION_LIMIT, 10),
    },
    fileStorageRoot: storagePath(process.env.FILE_STORAGE_ROOT),

    bootstrapSuperAdminName: optionalString(process.env.BOOTSTRAP_SUPER_ADMIN_NAME),
    bootstrapSuperAdminEmail: optionalString(process.env.BOOTSTRAP_SUPER_ADMIN_EMAIL),
    bootstrapSuperAdminPassword: optionalString(process.env.BOOTSTRAP_SUPER_ADMIN_PASSWORD),

    resendApiKey: optionalString(process.env.RESEND_API_KEY),
    emailFrom: optionalString(process.env.EMAIL_FROM),
    emailReplyTo: optionalString(process.env.EMAIL_REPLY_TO),
    quotationInternalEmail: optionalString(process.env.QUOTATION_INTERNAL_EMAIL),

    companyLegalName: requiredString(process.env.COMPANY_LEGAL_NAME, "COMPANY_LEGAL_NAME"),
    companyRuc: requiredString(process.env.COMPANY_TAX_ID, "COMPANY_TAX_ID"),
    companyPhone: requiredString(process.env.COMPANY_PHONE, "COMPANY_PHONE"),
    companyWhatsapp: requiredString(process.env.COMPANY_WHATSAPP, "COMPANY_WHATSAPP"),
    companyEmail: requiredString(process.env.COMPANY_EMAIL, "COMPANY_EMAIL"),
    companyOperationsEmail: requiredString(process.env.COMPANY_OPERATIONS_EMAIL, "COMPANY_OPERATIONS_EMAIL"),
    companyOperationsPhone: requiredString(process.env.COMPANY_OPERATIONS_PHONE, "COMPANY_OPERATIONS_PHONE"),
    companyWebsite: requiredString(process.env.COMPANY_WEBSITE, "COMPANY_WEBSITE"),
    companyAddress: optionalString(process.env.COMPANY_OFFICE_ADDRESS),
    companyLabAddress1: requiredString(process.env.COMPANY_LAB_ADDRESS_PRIMARY, "COMPANY_LAB_ADDRESS_PRIMARY"),
    companyLabAddress2: requiredString(process.env.COMPANY_LAB_ADDRESS_SECONDARY, "COMPANY_LAB_ADDRESS_SECONDARY"),
    companyInstagram: optionalString(process.env.COMPANY_INSTAGRAM_URL),
    companyFacebook: optionalString(process.env.COMPANY_FACEBOOK_URL),
    companyYoutube: optionalString(process.env.COMPANY_YOUTUBE_URL),
    companyLinkedin: optionalString(process.env.COMPANY_LINKEDIN_URL),
    companyTiktok: optionalString(process.env.COMPANY_TIKTOK_URL),

    quotationValidityDays: positiveInteger(process.env.QUOTATION_VALIDITY_DAYS, 7),
    quotationPaymentTerms: optionalString(process.env.QUOTATION_PAYMENT_TERMS) ?? "Contado",
    quotationServiceTime: optionalString(process.env.QUOTATION_SERVICE_TIME) ?? "3 días calendario",
    quotationDeliverables:
        optionalString(process.env.QUOTATION_DELIVERABLES) ?? "1 Certificado de calibración por equipo",
    quotationLaboratory:
        optionalString(process.env.QUOTATION_LABORATORY) ?? "ISOCAL, red de laboratorios Acreditados INACAL/A2LA",

    paymentAccountHolder: requiredString(process.env.PAYMENT_ACCOUNT_HOLDER, "PAYMENT_ACCOUNT_HOLDER"),
    paymentBcpAccountPen: requiredString(process.env.PAYMENT_BCP_ACCOUNT_PEN, "PAYMENT_BCP_ACCOUNT_PEN"),
    paymentBcpCciPen: requiredString(process.env.PAYMENT_BCP_CCI_PEN, "PAYMENT_BCP_CCI_PEN"),
    paymentBcpDetractionAccount: requiredString(process.env.PAYMENT_BCP_DETRACTION_ACCOUNT, "PAYMENT_BCP_DETRACTION_ACCOUNT"),
    paymentYapeNumber: requiredString(process.env.PAYMENT_YAPE_NUMBER, "PAYMENT_YAPE_NUMBER"),
};
