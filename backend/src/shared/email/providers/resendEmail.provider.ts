import { Resend } from "resend";
import type { EmailClient } from "../emailClient.js";
import { EmailProviderError } from "../email.errors.js";
import type { EmailMessage, EmailSendOptions, EmailSendResult } from "../email.types.js";
export class ResendEmailProvider implements EmailClient {
    private readonly resend: Resend;
    constructor(apiKey: string) { this.resend = new Resend(apiKey); }
    async send(message: EmailMessage, options: EmailSendOptions = {}): Promise<EmailSendResult> {
        try {
            const { data, error } = await this.resend.emails.send({
                from: message.from, to: message.to, subject: message.subject, html: message.html, text: message.text,
                ...(message.replyTo ? { replyTo: message.replyTo } : {}),
                ...(message.bcc?.length ? { bcc: message.bcc } : {}),
                attachments: message.attachments?.map((attachment) => ({ filename: attachment.filename, content: attachment.content })),
            }, options.idempotencyKey ? { idempotencyKey: options.idempotencyKey } : undefined);
            if (error)
                throw new EmailProviderError("resend", "RESEND_ERROR", error.message);
            if (!data?.id)
                throw new EmailProviderError("resend", "RESEND_EMPTY_RESPONSE", "Resend no devolvió un identificador de correo.");
            return { provider: "resend", messageId: data.id };
        }
        catch (error) {
            if (error instanceof EmailProviderError)
                throw error;
            throw new EmailProviderError("resend", "RESEND_REQUEST_FAILED", error instanceof Error ? error.message : "No se pudo contactar al proveedor de correo.");
        }
    }
}
