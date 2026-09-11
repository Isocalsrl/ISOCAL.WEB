import type { PublicProduct } from "../../products/types/product.types";

export interface QuoteRequestCustomerPayload {
    fullName: string;
    email: string;
    phone: string;
    companyName?: string;
    ruc?: string;
    jobTitle?: string;
    location?: string;
    notes?: string;
}

export interface QuoteRequestItemPayload {
    productId: number;
    quantity: number;
    notes?: string;
}

export interface CreateQuoteRequestPayload {
    customer: QuoteRequestCustomerPayload;
    items: QuoteRequestItemPayload[];
}

export interface QuoteRequestReceipt {
    reference: string;
    status: "pending";
    createdAt: string;
}

export interface CreateQuoteRequestResponse {
    quote: QuoteRequestReceipt;
}

export interface QuoteRequestItemFormValue {
    productId: number;
    quantity: string;
    notes: string;
}

export interface QuoteRequestFormValues {
    fullName: string;
    email: string;
    phone: string;
    companyName: string;
    ruc: string;
    jobTitle: string;
    location: string;
    notes: string;
    items: QuoteRequestItemFormValue[];
}

export type QuoteRequestCustomerField = Exclude<
    keyof QuoteRequestFormValues,
    "items"
>;

export interface UseQuoteRequestOptions {
    products: readonly PublicProduct[];
    onSuccess: () => void;
}
