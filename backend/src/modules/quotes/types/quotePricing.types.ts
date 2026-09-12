import type { QuoteCurrency } from "./quote.types.js";

export interface QuotePricingItemInput {
    itemId: number;
    unitPrice: number;
    discountAmount?: number;
}

export interface QuotePricingInput {
    items: QuotePricingItemInput[];
    discountAmount?: number;
    taxRate?: number;
}

export interface QuoteCommercialDetailsInput {
    currency?: QuoteCurrency;
    validUntil?: string | null;
    paymentTerms?: string | null;
    commercialNotes?: string | null;
    internalNotes?: string | null;
}

export interface QuoteRejectionInput {
    reason?: string | null;
}
