import type { QuoteDetail, QuoteItem, QuoteStatus } from "./quotes.types.js";

export interface QuoteRow {
    id: string | number;
    reference: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    company_name: string | null;
    ruc: string | null;
    job_title: string | null;
    location: string | null;
    customer_notes: string | null;
    status: QuoteStatus;
    created_at: Date;
    updated_at: Date;
    sent_at: Date | null;
}

export interface QuoteItemRow {
    id: string | number;
    product_id: number;
    product_name: string;
    product_description: string | null;
    quantity: number;
    customer_notes: string | null;
    image_storage_key: string | null;
}

export function toQuoteItem(row: QuoteItemRow): QuoteItem {
    return {
        id: Number(row.id),
        productId: row.product_id,
        productName: row.product_name,
        productDescription: row.product_description,
        quantity: row.quantity,
        customerNotes: row.customer_notes,
        unitPrice: null,
        discountAmount: 0,
        subtotal: null,
        imageStorageKey: row.image_storage_key,
    };
}

export function toQuoteDetail(row: QuoteRow, items: QuoteItem[]): QuoteDetail {
    return {
        id: Number(row.id),
        reference: row.reference,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        customerPhone: row.customer_phone,
        companyName: row.company_name,
        ruc: row.ruc,
        jobTitle: row.job_title,
        location: row.location,
        customerNotes: row.customer_notes,
        status: row.status,
        subtotal: null,
        discountAmount: 0,
        taxRate: 18,
        taxAmount: null,
        total: null,
        currency: "PEN",
        validUntil: null,
        paymentTerms: null,
        commercialNotes: null,
        internalNotes: null,
        pricedAt: null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        sentAt: row.sent_at,
        items,
    };
}
