import { env } from "../../config/env.js";
import { EmailConfigurationError } from "./email.errors.js";
import type { EmailClient } from "./emailClient.js";
import type { EmailMessage, EmailSendOptions, EmailSendResult } from "./email.types.js";
import { ResendEmailProvider } from "./providers/resendEmail.provider.js";

let client: EmailClient | null = null;
function getClient(): EmailClient {
    if (client) return client;
    if (!env.resendApiKey) throw new EmailConfigurationError("RESEND_API_KEY no está configurada.");
    client = new ResendEmailProvider(env.resendApiKey);
    return client;
}
export const emailService = { send(message: EmailMessage, options?: EmailSendOptions): Promise<EmailSendResult> { return getClient().send(message, options); } };
