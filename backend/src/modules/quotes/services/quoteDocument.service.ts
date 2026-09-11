import type { Admin } from "../../auth/auth.types.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { binaryStorage } from "../../../shared/storage/storageService.js";
import { buildStorageKey } from "../../../shared/storage/providers/localFileStorage.provider.js";
import { mapQuoteToDocument } from "../mappers/quoteDocument.mapper.js";
import { findAdminQuoteById } from "../repositories/quotes.admin.read.repository.js";
import { refreshStoredQuotePricing } from "../repositories/quotes.admin.update.repository.js";
import { savePreparedQuoteDocument } from "../repositories/quotes.document.repository.js";
import type { QuoteDocument } from "../quoteDocument.types.js";
import { recalculateStoredQuotePricing } from "./quotePricing.service.js";
import { generateQuotePdf } from "./quotePdf.service.js";

function currentLimaDate(): string {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Lima", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
}

export async function prepareQuoteDocument(quoteId: number, admin: Admin): Promise<QuoteDocument> {
    const current = await findAdminQuoteById(quoteId);
    if (!current) throw new AppError(404, "Cotización no encontrada.", "QUOTE_NOT_FOUND");
    if (current.quote.status !== "priced") throw new AppError(409, "La cotización debe encontrarse en estado priced antes de generar el PDF.", "INVALID_QUOTE_TRANSITION");
    if (!current.quote.paymentTerms) throw new AppError(409, "Debes establecer las condiciones de pago antes de preparar la cotización.", "QUOTE_PAYMENT_TERMS_REQUIRED");
    if (!current.quote.validUntil) throw new AppError(409, "Debes establecer la vigencia antes de preparar la cotización.", "QUOTE_VALID_UNTIL_REQUIRED");
    if (current.quote.validUntil < currentLimaDate()) throw new AppError(409, "La fecha de vigencia de la cotización ya venció.", "QUOTE_VALID_UNTIL_EXPIRED");
    if (current.items.length === 0) throw new AppError(409, "La cotización no contiene productos.", "QUOTE_HAS_NO_ITEMS");

    const recalculated = recalculateStoredQuotePricing(current.items, current.quote.discountAmount, current.quote.taxRate);
    const refreshed = await refreshStoredQuotePricing({ quoteId, ...recalculated });
    if (!refreshed) throw new AppError(409, "La cotización cambió mientras se recalculaban sus importes.", "QUOTE_CONCURRENT_UPDATE");
    const latest = await findAdminQuoteById(quoteId);
    if (!latest) throw new AppError(404, "Cotización no encontrada.", "QUOTE_NOT_FOUND");
    const issuedAt = new Date();
    const documentData = mapQuoteToDocument(latest.quote, latest.items, issuedAt);
    const pdf = await generateQuotePdf(documentData);
    const storageKey = buildStorageKey({ resourceType: "quotes", resourceId: quoteId, assetRole: "document", extension: "pdf" });
    const stored = await binaryStorage.save({ key: storageKey, content: pdf });
    try {
        const document = await savePreparedQuoteDocument({ quoteId, generatedBy: admin.id, generatedAt: issuedAt, storageKey: stored.key, fileName: `${latest.quote.reference}.pdf`, mimeType: "application/pdf", fileSizeBytes: stored.sizeBytes, sha256: stored.sha256 });
        if (!document) throw new AppError(409, "La cotización cambió mientras se generaba el documento.", "QUOTE_CONCURRENT_UPDATE");
        return document;
    } catch (error) {
        await binaryStorage.delete(stored.key).catch(() => undefined);
        throw error;
    }
}
