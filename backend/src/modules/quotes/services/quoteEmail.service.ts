import type { Admin } from "../../auth/auth.types.js";
import { env } from "../../../config/env.js";
import { EmailConfigurationError, EmailProviderError } from "../../../shared/email/email.errors.js";
import { emailService } from "../../../shared/email/emailService.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { binaryStorage } from "../../../shared/storage/storageService.js";
import { findAdminQuoteById } from "../repositories/quotes.admin.read.repository.js";
import { findCurrentQuoteDocument } from "../repositories/quotes.document.repository.js";
import { createResendDeliveryAttempt, getOrCreateInitialDeliveryAttempt, markDeliveryFailed, markInitialDeliverySent, markResendDeliverySent } from "../repositories/quotes.delivery.repository.js";
import { buildQuoteEmail } from "../templates/quoteEmail.template.js";

function assertEmailConfiguration(): string { if (!env.emailFrom) throw new AppError(500, "EMAIL_FROM no está configurado.", "EMAIL_CONFIGURATION_MISSING"); if (!env.resendApiKey) throw new AppError(500, "RESEND_API_KEY no está configurada.", "EMAIL_CONFIGURATION_MISSING"); return env.emailFrom; }
function failure(error: unknown): { code: string; message: string } { if (error instanceof EmailProviderError) return { code: error.code, message: error.message }; if (error instanceof EmailConfigurationError) return { code: "EMAIL_CONFIGURATION_ERROR", message: error.message }; return { code: "EMAIL_SEND_FAILED", message: error instanceof Error ? error.message : "No se pudo enviar el correo." }; }

async function sendPreparedDocument(quoteId: number, admin: Admin, mode: "send" | "resend"): Promise<void> {
    const from = assertEmailConfiguration();
    const [record, document] = await Promise.all([findAdminQuoteById(quoteId), findCurrentQuoteDocument(quoteId)]);
    if (!record) throw new AppError(404, "Cotización no encontrada.", "QUOTE_NOT_FOUND");
    if (!document) throw new AppError(409, "La cotización no dispone de un documento preparado.", "QUOTE_DOCUMENT_NOT_FOUND");
    if (mode === "send" && record.quote.status !== "ready_to_send") throw new AppError(409, "La cotización debe estar lista para envío.", "INVALID_QUOTE_TRANSITION");
    if (mode === "resend" && record.quote.status !== "sent") throw new AppError(409, "Solo es posible reenviar una cotización que ya fue enviada.", "INVALID_QUOTE_TRANSITION");
    let pdf: Buffer;
    try { pdf = await binaryStorage.read(document.storageKey); } catch { throw new AppError(500, "El PDF preparado no se encuentra disponible en almacenamiento.", "QUOTE_DOCUMENT_STORAGE_ERROR"); }
    const attempt = mode === "send" ? await getOrCreateInitialDeliveryAttempt({ quoteId: record.quote.id, documentFileId: document.id, recipientEmail: record.quote.customerEmail, provider: "resend", requestedBy: admin.id }) : await createResendDeliveryAttempt({ quoteId: record.quote.id, documentFileId: document.id, recipientEmail: record.quote.customerEmail, provider: "resend", requestedBy: admin.id });
    const email = buildQuoteEmail({ customerName: record.quote.customerName, reference: record.quote.reference, companyPhone: env.companyPhone, companyEmail: env.companyEmail });
    try {
        const result = await emailService.send({ from, to: [record.quote.customerEmail], ...(env.emailReplyTo ? { replyTo: env.emailReplyTo } : {}), subject: email.subject, html: email.html, text: email.text, attachments: [{ filename: document.fileName, content: pdf }] }, { idempotencyKey: attempt.idempotencyKey });
        const persisted = mode === "send" ? await markInitialDeliverySent(attempt.id, record.quote.id, admin.id, result.messageId) : await markResendDeliverySent(attempt.id, record.quote.id, admin.id, result.messageId);
        if (!persisted) throw new AppError(409, "El correo fue procesado, pero el estado cambió durante la operación.", "QUOTE_DELIVERY_CONCURRENT_UPDATE");
    } catch (error) {
        if (error instanceof AppError && error.code === "QUOTE_DELIVERY_CONCURRENT_UPDATE") throw error;
        const details = failure(error); await markDeliveryFailed(attempt.id, record.quote.id, admin.id, details.code, details.message).catch(() => undefined);
        throw new AppError(502, "No se pudo enviar la cotización. El documento permanece guardado y puedes reintentar.", "QUOTE_EMAIL_SEND_FAILED", { provider: "resend" });
    }
}
export function sendQuoteEmail(quoteId: number, admin: Admin): Promise<void> { return sendPreparedDocument(quoteId, admin, "send"); }
export function resendQuoteEmail(quoteId: number, admin: Admin): Promise<void> { return sendPreparedDocument(quoteId, admin, "resend"); }
