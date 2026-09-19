export type QuoteStatus = "pending" | "sent";

export interface QuoteItem {
    id: number;
    productId: number;
    productName: string;
    productDescription: string | null;
    quantity: number;
    customerNotes: string | null;
    unitPrice: null;
    discountAmount: 0;
    subtotal: null;
    imageStorageKey: string | null;
}

export interface QuoteDetail {
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
    subtotal: null;
    discountAmount: 0;
    taxRate: 18;
    taxAmount: null;
    total: null;
    currency: "PEN";
    validUntil: null;
    paymentTerms: null;
    commercialNotes: null;
    internalNotes: null;
    pricedAt: null;
    createdAt: Date;
    updatedAt: Date;
    sentAt: Date | null;
    items: QuoteItem[];
}

export interface CreateStoredQuoteInput {
    reference: string;
    customer: {
        fullName: string;
        email: string;
        phone: string;
        companyName?: string | null;
        ruc?: string | null;
        jobTitle?: string | null;
        location?: string | null;
        notes?: string | null;
    };
    items: {
        productId: number;
        productName: string;
        quantity: number;
        notes?: string | null;
    }[];
}
