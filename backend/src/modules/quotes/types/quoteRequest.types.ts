export interface QuoteCustomerInput {
    fullName: string;
    email: string;
    phone: string;
    companyName?: string | null;
    ruc?: string | null;
    jobTitle?: string | null;
    location?: string | null;
    notes?: string | null;
}

export interface CreateQuoteItemInput {
    productId: number;
    quantity: number;
    notes?: string | null;
}

export interface CreateQuoteInput {
    customer: QuoteCustomerInput;
    items: CreateQuoteItemInput[];
}

export interface NormalizedQuoteCustomerInput {
    fullName: string;
    email: string;
    phone: string;
    companyName: string | null;
    ruc: string | null;
    jobTitle: string | null;
    location: string | null;
    notes: string | null;
}

export interface NormalizedCreateQuoteItemInput {
    productId: number;
    quantity: number;
    notes: string | null;
}

export interface NormalizedCreateQuoteInput {
    customer: NormalizedQuoteCustomerInput;
    items: NormalizedCreateQuoteItemInput[];
}

export interface QuoteProductSnapshot {
    id: number;
    name: string;
}

export interface QuoteItemRecordInput {
    productId: number;
    productName: string;
    quantity: number;
    customerNotes: string | null;
}

export interface CreateQuoteRecordInput {
    reference: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    companyName: string | null;
    ruc: string | null;
    jobTitle: string | null;
    location: string | null;
    customerNotes: string | null;
    items: QuoteItemRecordInput[];
}

export interface PublicQuoteReceipt {
    reference: string;
    status: "pending";
    createdAt: Date;
}
