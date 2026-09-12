export type QuoteStatus =
    | "pending"
    | "in_review"
    | "priced"
    | "ready_to_send"
    | "sent"
    | "rejected";

export type QuoteCurrency = "PEN";

export type QuoteEventType =
    | "review_started"
    | "pricing_updated"
    | "commercial_details_updated"
    | "prepared"
    | "rejected"
    | "document_generated"
    | "email_sent"
    | "email_failed"
    | "email_resent";

export type QuoteAdminAccess = "admin" | "super_admin";

export interface Quote {
    id: number;
    reference: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    companyName: string | null;
    ruc: string | null;
    jobTitle: string | null;
    location: string | null;
    customerNotes: string | null;
    status: QuoteStatus;
    subtotal: number | null;
    discountAmount: number;
    taxRate: number;
    taxAmount: number | null;
    total: number | null;
    currency: QuoteCurrency;
    validUntil: string | null;
    paymentTerms: string | null;
    commercialNotes: string | null;
    internalNotes: string | null;
    pricedBy: number | null;
    pricedAt: Date | null;
    sentAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface QuoteItem {
    id: number;
    quoteId: number;
    productId: number;
    productName: string;
    quantity: number;
    customerNotes: string | null;
    unitPrice: number | null;
    discountAmount: number;
    subtotal: number | null;
    createdAt: Date;
}
