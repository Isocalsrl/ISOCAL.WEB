export interface EmailAttachment {
    filename: string;
    content: Buffer;
}
export interface EmailMessage {
    from: string;
    to: string[];
    bcc?: string[];
    replyTo?: string;
    subject: string;
    html: string;
    text: string;
    attachments?: EmailAttachment[];
}
export interface EmailSendOptions {
    idempotencyKey?: string;
}
export interface EmailSendResult {
    provider: string;
    messageId: string;
}
