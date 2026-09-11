import { AppError } from "../../../shared/errors/AppError.js";
import type { AdminRole } from "../../auth/auth.types.js";
import { findAdminQuoteById, findAdminQuotes, findQuoteHistory } from "../repositories/quotes.admin.read.repository.js";
import { prepareQuote, rejectQuote, startReview, updateCommercialDetails } from "../repositories/quotes.admin.update.repository.js";
import { toAdminQuoteDetail, toAdminQuoteListItem } from "../quotes.mapper.js";
import type { AdminQuoteDetail, AdminQuoteListItem, QuoteCommercialDetailsInput, QuoteHistoryEvent, QuoteRejectionInput, QuoteStatus } from "../quotes.types.js";
import { applyPricing } from "./quotePricing.service.js";

function superAdmin(role: AdminRole): void { if (role !== "super_admin") throw new AppError(403, "No tienes permisos para realizar esta acción.", "FORBIDDEN"); }
function idError(): never { throw new AppError(404, "Cotización no encontrada.", "QUOTE_NOT_FOUND"); }

export async function listAdminQuotes(role: AdminRole, status?: string): Promise<AdminQuoteListItem[]> {
    const validStatus: QuoteStatus | undefined = status && ["pending", "in_review", "priced", "ready_to_send", "sent", "rejected"].includes(status) ? status as QuoteStatus : undefined;
    if (status && !validStatus) throw new AppError(400, "El estado solicitado no es válido.", "VALIDATION_ERROR");
    const records = await findAdminQuotes(validStatus);
    return records.map((record) => toAdminQuoteListItem(record.quote, record.itemCount, role));
}

export async function getAdminQuote(id: number, role: AdminRole): Promise<AdminQuoteDetail> {
    const record = await findAdminQuoteById(id);
    if (!record) idError();
    return toAdminQuoteDetail(record.quote, record.items, role);
}

export async function reviewQuote(id: number, actorAdminId: number, role: AdminRole): Promise<AdminQuoteDetail> {
    const quote = await startReview(id, actorAdminId);
    if (!quote) throw new AppError(409, "La cotización no existe o ya no está pendiente.", "QUOTE_INVALID_STATE");
    return getAdminQuote(quote.id, role);
}

export async function priceQuote(id: number, input: Parameters<typeof applyPricing>[1], actorAdminId: number, role: AdminRole): Promise<AdminQuoteDetail> {
    await applyPricing(id, input, actorAdminId, role);
    return getAdminQuote(id, role);
}

export async function editCommercialDetails(id: number, input: QuoteCommercialDetailsInput, actorAdminId: number, role: AdminRole): Promise<AdminQuoteDetail> {
    superAdmin(role);
    const current = await findAdminQuoteById(id);
    if (!current) idError();
    if (!["in_review", "priced", "ready_to_send"].includes(current.quote.status)) throw new AppError(409, "La cotización no está disponible para editar sus condiciones comerciales.", "QUOTE_INVALID_STATE");
    await updateCommercialDetails(id, actorAdminId, input);
    return getAdminQuote(id, role);
}

export async function prepare(id: number, actorAdminId: number, role: AdminRole): Promise<AdminQuoteDetail> {
    superAdmin(role);
    const current = await findAdminQuoteById(id);
    if (!current) idError();
    if (current.quote.status !== "priced") throw new AppError(409, "Solo una cotización valorizada puede prepararse.", "QUOTE_INVALID_STATE");
    if (current.items.some((item) => item.unitPrice === null || item.subtotal === null) || current.quote.taxAmount === null || current.quote.total === null || !current.quote.paymentTerms || !current.quote.validUntil) {
        throw new AppError(400, "La cotización necesita precios, totales, condiciones de pago y vigencia antes de prepararse.", "QUOTE_INCOMPLETE");
    }
    const validUntil = new Date(`${current.quote.validUntil}T00:00:00Z`);
    if (Number.isNaN(validUntil.getTime()) || validUntil < new Date()) throw new AppError(400, "La vigencia de la cotización no es válida.", "QUOTE_INCOMPLETE");
    const quote = await prepareQuote(id, actorAdminId);
    if (!quote) throw new AppError(409, "La cotización cambió de estado y no pudo prepararse.", "QUOTE_INVALID_STATE");
    return getAdminQuote(id, role);
}

export async function reject(id: number, input: QuoteRejectionInput, actorAdminId: number, role: AdminRole): Promise<AdminQuoteDetail> {
    superAdmin(role);
    const quote = await rejectQuote(id, actorAdminId, input.reason ?? null);
    if (!quote) throw new AppError(409, "La cotización no puede rechazarse en su estado actual.", "QUOTE_INVALID_STATE");
    return getAdminQuote(id, role);
}

export async function history(id: number, role: AdminRole): Promise<QuoteHistoryEvent[]> {
    superAdmin(role);
    const current = await findAdminQuoteById(id);
    if (!current) idError();
    return findQuoteHistory(id);
}
