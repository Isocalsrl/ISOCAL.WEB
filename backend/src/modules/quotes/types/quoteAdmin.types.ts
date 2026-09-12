import type {
    QuoteAdminAccess,
    QuoteCurrency,
    QuoteEventType,
    QuoteStatus,
} from "./quote.types.js";

export interface QuoteCustomerView {
    name: string;
    companyName: string | null;
    email: string;
    phone: string;
    ruc?: string | null;
    jobTitle?: string | null;
    location?: string | null;
}

export interface QuoteItemView {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    customerNotes: string | null;
    unitPrice?: number | null;
    discountAmount?: number;
    subtotal?: number | null;
}

export interface QuoteCommercialView {
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
}

export interface QuotePermissions {
    canReview: boolean;
    canPrice: boolean;
    canEditCommercial: boolean;
    canPrepare: boolean;
    canReject: boolean;
}

export interface AdminQuoteListItem {
    access: QuoteAdminAccess;
    id: number;
    reference: string;
    status: QuoteStatus;
    createdAt: Date;
    customer: QuoteCustomerView;
    itemCount: number;
}

export interface AdminQuoteDetail extends AdminQuoteListItem {
    updatedAt: Date;
    customerNotes: string | null;
    items: QuoteItemView[];
    commercial?: QuoteCommercialView;
    permissions: QuotePermissions;
}

export interface QuoteHistoryEvent {
    id: number;
    quoteId: number;
    actorAdminId: number | null;
    actorAdminName: string | null;
    eventType: QuoteEventType;
    fromStatus: QuoteStatus | null;
    toStatus: QuoteStatus | null;
    note: string | null;
    createdAt: Date;
}
