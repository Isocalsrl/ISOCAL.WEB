import type { EmailMessage, EmailSendOptions, EmailSendResult } from "./email.types.js";
export interface EmailClient {
    send(message: EmailMessage, options?: EmailSendOptions): Promise<EmailSendResult>;
}
