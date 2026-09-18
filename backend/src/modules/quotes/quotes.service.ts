import { env } from "../../config/env.js";
import { emailService } from "../../shared/email/emailService.js";
import { EmailConfigurationError, EmailProviderError } from "../../shared/email/email.errors.js";
import { AppError } from "../../shared/errors/AppError.js";
import { binaryStorage } from "../../shared/storage/storageService.js";
import { buildStorageKey } from "../../shared/storage/providers/localFileStorage.provider.js";
import { createCommercialQuotePdf, type CommercialQuotePdfInput } from "./documents/commercialQuotePdf.js";
import * as repository from "./quotes.repository.js";
import type { CreateStoredQuoteInput, QuoteDetail } from "./quotes.types.js";

export interface AutomaticQuoteDelivery {
    quoteId: number;
    messageId: string;
    document: {
        filename: string;
        contentBase64: string;
        mimeType: "application/pdf";
    };
}

async function getQuote(id: number): Promise<QuoteDetail> {
    const quote = await repository.findQuoteById(id);
    if (!quote) throw new AppError(404, "La cotización solicitada no existe.", "QUOTE_NOT_FOUND");
    return quote;
}

async function enrichForPdf(quote: QuoteDetail): Promise<CommercialQuotePdfInput> {
    const items = await Promise.all(
        quote.items.map(async (item) => ({
            ...item,
            image: item.imageStorageKey ? await binaryStorage.read(item.imageStorageKey).catch(() => null) : null,
        })),
    );
    return { ...quote, items };
}

async function buildPdf(quote: QuoteDetail): Promise<Buffer> {
    return createCommercialQuotePdf(await enrichForPdf(quote));
}

function emailBody(quote: QuoteDetail): { text: string; html: string } {
    const safeName = quote.customerName.replace(/[<>]/g, "");
    return {
        text: [
            `Hola ${safeName},`,
            "",
            "Gracias por confiar en ISOCAL.",
            "",
            "Adjuntamos tu cotización en PDF con el detalle de los equipos solicitados y las condiciones comerciales correspondientes.",
            "",
            "Si deseas ajustar una cantidad, agregar un modelo o rango, o complementar algún requerimiento técnico, responde a este correo y nuestro equipo continuará contigo.",
            "",
            "Saludos,",
            "Equipo comercial ISOCAL",
            "Metrología, consultoría y equipamiento",
        ].join("\n"),
        html: `
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0;padding:0;background:#f4f6f7;font-family:Arial,Helvetica,sans-serif;color:#142936;">
  <tr>
    <td align="center" style="padding:28px 14px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;background:#ffffff;border:1px solid #e1e6e8;">
        <tr>
          <td style="padding:20px 28px;background:#d9092f;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:.02em;">ISOCAL</td>
        </tr>
        <tr>
          <td style="padding:30px 28px 12px;">
            <p style="margin:0 0 14px;font-size:16px;line-height:1.65;">Hola <strong>${safeName}</strong>,</p>
            <p style="margin:0 0 14px;font-size:15px;line-height:1.7;">Gracias por confiar en <strong>ISOCAL</strong>.</p>
            <p style="margin:0 0 14px;font-size:15px;line-height:1.7;">Adjuntamos tu cotización en PDF con el detalle de los equipos solicitados y las condiciones comerciales correspondientes.</p>
            <p style="margin:0;font-size:15px;line-height:1.7;">Si deseas ajustar una cantidad, agregar un modelo o rango, o complementar algún requerimiento técnico, responde a este correo y nuestro equipo continuará contigo.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:18px 28px 30px;">
            <p style="margin:0;font-size:14px;line-height:1.6;color:#536670;">Saludos,<br><strong style="color:#142936;">Equipo comercial ISOCAL</strong><br>Metrología, consultoría y equipamiento</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`,
    };
}

async function deliverQuote(quoteId: number): Promise<AutomaticQuoteDelivery> {
    if (!env.emailFrom || !env.resendApiKey) {
        throw new AppError(503, "El envío por correo no está configurado.", "EMAIL_UNAVAILABLE");
    }

    const quote = await getQuote(quoteId);
    const pdf = await buildPdf(quote);
    const filename = "Cotizacion-ISOCAL.pdf";

    const stored = await binaryStorage.save({
        key: buildStorageKey({
            resourceType: "quotes",
            resourceId: quote.id,
            assetRole: "commercial_quote",
            extension: "pdf",
        }),
        content: pdf,
    });

    const documentFileId = await repository.saveGeneratedDocument(quote.id, null, {
        storageKey: stored.key,
        fileName: filename,
        sizeBytes: stored.sizeBytes,
        sha256: stored.sha256,
    });

    const idempotencyKey = `quote-${quote.id}-document-${documentFileId}`;
    const deliveryId = await repository.createEmailDelivery({
        quoteId: quote.id,
        documentFileId,
        recipientEmail: quote.customerEmail,
        idempotencyKey,
    });

    const internalEmail = env.quotationInternalEmail;
    const bcc = internalEmail && internalEmail.toLowerCase() !== quote.customerEmail.toLowerCase()
        ? [internalEmail]
        : undefined;

    try {
        const result = await emailService.send(
            {
                from: env.emailFrom,
                to: [quote.customerEmail],
                ...(bcc ? { bcc } : {}),
                replyTo: env.emailReplyTo ?? env.companyEmail,
                subject: "Tu cotización ISOCAL está lista",
                ...emailBody(quote),
                attachments: [{ filename, content: pdf }],
            },
            { idempotencyKey },
        );

        await repository.markEmailDeliverySent({
            deliveryId,
            quoteId: quote.id,
            provider: result.provider,
            providerMessageId: result.messageId,
        });

        return {
            quoteId: quote.id,
            messageId: result.messageId,
            document: {
                filename,
                contentBase64: pdf.toString("base64"),
                mimeType: "application/pdf",
            },
        };
    } catch (error) {
        const code = error instanceof EmailProviderError
            ? error.code
            : error instanceof EmailConfigurationError
              ? "EMAIL_CONFIGURATION"
              : "EMAIL_SEND_FAILED";
        const message = error instanceof Error ? error.message : "No se pudo enviar la cotización.";
        await repository.markEmailDeliveryFailed(deliveryId, quote.id, code, message);
        throw new AppError(502, "No se pudo enviar la cotización por correo.", "QUOTE_EMAIL_FAILED");
    }
}

export async function createAndSendAutomaticQuote(input: CreateStoredQuoteInput): Promise<AutomaticQuoteDelivery> {
    const quoteId = await repository.createQuote(input);
    return deliverQuote(quoteId);
}
