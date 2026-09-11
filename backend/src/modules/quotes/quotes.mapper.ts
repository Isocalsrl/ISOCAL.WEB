import type { Quote, QuoteStatus } from "./quotes.types.js";

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
}

export function toQuote(row: QuoteRow): Quote {
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
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
