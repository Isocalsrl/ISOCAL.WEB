export type QuoteEmailAttemptType = "send" | "resend";
export type QuoteEmailDeliveryStatus = "pending" | "sent" | "failed";
export interface QuoteEmailDelivery { id: number; quoteId: number; documentFileId: number; attemptType: QuoteEmailAttemptType; recipientEmail: string; provider: string; providerMessageId: string | null; status: QuoteEmailDeliveryStatus; idempotencyKey: string; errorCode: string | null; errorMessage: string | null; requestedBy: number | null; createdAt: Date; sentAt: Date | null; }
