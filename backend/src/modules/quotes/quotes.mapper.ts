import type { AdminRole } from "../auth/auth.types.js";
import { maskEmail, maskPhone } from "./utils/contactMask.js";
import type { AdminQuoteDetail, AdminQuoteListItem, Quote, QuoteEventType, QuoteHistoryEvent, QuoteItem, QuoteItemView, QuoteStatus } from "./quotes.types.js";

export interface QuoteRow {
    id: string | number; reference: string; customer_name: string; customer_email: string; customer_phone: string;
    company_name: string | null; ruc: string | null; job_title: string | null; location: string | null; customer_notes: string | null;
    status: QuoteStatus; subtotal: string | null; discount_amount: string; tax_rate: string; tax_amount: string | null; total: string | null;
    currency: "PEN"; valid_until: string | null; payment_terms: string | null; commercial_notes: string | null; internal_notes: string | null;
    priced_by: number | null; priced_at: Date | null; sent_at: Date | null; created_at: Date; updated_at: Date;
}
export interface QuoteItemRow { id: string | number; quote_id: string | number; product_id: number; product_name: string; quantity: number; customer_notes: string | null; unit_price: string | null; discount_amount: string; subtotal: string | null; created_at: Date; }
export interface QuoteHistoryEventRow { id: string | number; quote_id: string | number; actor_admin_id: number | null; actor_admin_name: string | null; event_type: QuoteEventType; from_status: QuoteStatus | null; to_status: QuoteStatus | null; note: string | null; created_at: Date; }

function money(value: string | null): number | null { return value === null ? null : Number(value); }

export function toQuote(row: QuoteRow): Quote {
    return {
        id: Number(row.id), reference: row.reference, customerName: row.customer_name, customerEmail: row.customer_email, customerPhone: row.customer_phone,
        companyName: row.company_name, ruc: row.ruc, jobTitle: row.job_title, location: row.location, customerNotes: row.customer_notes,
        status: row.status, subtotal: money(row.subtotal), discountAmount: Number(row.discount_amount), taxRate: Number(row.tax_rate), taxAmount: money(row.tax_amount), total: money(row.total),
        currency: row.currency, validUntil: row.valid_until, paymentTerms: row.payment_terms, commercialNotes: row.commercial_notes, internalNotes: row.internal_notes,
        pricedBy: row.priced_by, pricedAt: row.priced_at, sentAt: row.sent_at, createdAt: row.created_at, updatedAt: row.updated_at,
    };
}

export function toQuoteItem(row: QuoteItemRow): QuoteItem {
    return { id: Number(row.id), quoteId: Number(row.quote_id), productId: row.product_id, productName: row.product_name, quantity: row.quantity, customerNotes: row.customer_notes, unitPrice: money(row.unit_price), discountAmount: Number(row.discount_amount), subtotal: money(row.subtotal), createdAt: row.created_at };
}

function permissions(quote: Quote, role: AdminRole) {
    const superAdmin = role === "super_admin";
    const mutable = quote.status !== "sent" && quote.status !== "rejected";
    const commercial = quote.status === "in_review" || quote.status === "priced" || quote.status === "ready_to_send";
    return { canReview: quote.status === "pending", canPrice: superAdmin && commercial, canEditCommercial: superAdmin && commercial, canPrepare: superAdmin && quote.status === "priced", canReject: superAdmin && mutable };
}

export function toAdminQuoteListItem(quote: Quote, itemCount: number, role: AdminRole): AdminQuoteListItem {
    const superAdmin = role === "super_admin";
    return { access: role, id: quote.id, reference: quote.reference, status: quote.status, createdAt: quote.createdAt, itemCount, customer: { name: quote.customerName, companyName: quote.companyName, email: superAdmin ? quote.customerEmail : maskEmail(quote.customerEmail), phone: superAdmin ? quote.customerPhone : maskPhone(quote.customerPhone) } };
}

export function toAdminQuoteDetail(quote: Quote, items: QuoteItem[], role: AdminRole): AdminQuoteDetail {
    const superAdmin = role === "super_admin";
    const base = toAdminQuoteListItem(quote, items.length, role);
    const mappedItems: QuoteItemView[] = items.map((item) => ({ id: item.id, productId: item.productId, productName: item.productName, quantity: item.quantity, customerNotes: item.customerNotes, ...(superAdmin ? { unitPrice: item.unitPrice, discountAmount: item.discountAmount, subtotal: item.subtotal } : {}) }));
    return {
        ...base, updatedAt: quote.updatedAt, customerNotes: quote.customerNotes, items: mappedItems,
        ...(superAdmin ? { customer: { ...base.customer, ruc: quote.ruc, jobTitle: quote.jobTitle, location: quote.location }, commercial: { subtotal: quote.subtotal, discountAmount: quote.discountAmount, taxRate: quote.taxRate, taxAmount: quote.taxAmount, total: quote.total, currency: quote.currency, validUntil: quote.validUntil, paymentTerms: quote.paymentTerms, commercialNotes: quote.commercialNotes, internalNotes: quote.internalNotes, pricedBy: quote.pricedBy, pricedAt: quote.pricedAt, sentAt: quote.sentAt } } : {}),
        permissions: permissions(quote, role),
    };
}

export function toQuoteHistoryEvent(row: QuoteHistoryEventRow): QuoteHistoryEvent {
    return { id: Number(row.id), quoteId: Number(row.quote_id), actorAdminId: row.actor_admin_id, actorAdminName: row.actor_admin_name, eventType: row.event_type, fromStatus: row.from_status, toStatus: row.to_status, note: row.note, createdAt: row.created_at };
}
