export type QuoteStatus = "pending" | "in_review" | "priced" | "ready_to_send" | "sent" | "rejected";
export type QuoteCurrency = "PEN";
export type QuoteEventType = "review_started" | "pricing_updated" | "commercial_details_updated" | "prepared" | "rejected" | "document_generated" | "email_sent" | "email_failed" | "email_resent";
export type QuoteAdminAccess = "admin" | "super_admin";

export interface QuoteCustomerInput { fullName: string; email: string; phone: string; companyName?: string | null; ruc?: string | null; jobTitle?: string | null; location?: string | null; notes?: string | null; }
export interface CreateQuoteItemInput { productId: number; quantity: number; notes?: string | null; }
export interface CreateQuoteInput { customer: QuoteCustomerInput; items: CreateQuoteItemInput[]; }
export interface NormalizedQuoteCustomerInput { fullName: string; email: string; phone: string; companyName: string | null; ruc: string | null; jobTitle: string | null; location: string | null; notes: string | null; }
export interface NormalizedCreateQuoteItemInput { productId: number; quantity: number; notes: string | null; }
export interface NormalizedCreateQuoteInput { customer: NormalizedQuoteCustomerInput; items: NormalizedCreateQuoteItemInput[]; }
export interface QuoteProductSnapshot { id: number; name: string; }
export interface QuoteItemRecordInput { productId: number; productName: string; quantity: number; customerNotes: string | null; }
export interface CreateQuoteRecordInput { reference: string; customerName: string; customerEmail: string; customerPhone: string; companyName: string | null; ruc: string | null; jobTitle: string | null; location: string | null; customerNotes: string | null; items: QuoteItemRecordInput[]; }

export interface Quote {
    id: number; reference: string; customerName: string; customerEmail: string; customerPhone: string;
    companyName: string | null; ruc: string | null; jobTitle: string | null; location: string | null; customerNotes: string | null;
    status: QuoteStatus; subtotal: number | null; discountAmount: number; taxRate: number; taxAmount: number | null; total: number | null;
    currency: QuoteCurrency; validUntil: string | null; paymentTerms: string | null; commercialNotes: string | null; internalNotes: string | null;
    pricedBy: number | null; pricedAt: Date | null; sentAt: Date | null; createdAt: Date; updatedAt: Date;
}
export interface QuoteItem { id: number; quoteId: number; productId: number; productName: string; quantity: number; customerNotes: string | null; unitPrice: number | null; discountAmount: number; subtotal: number | null; createdAt: Date; }
export interface PublicQuoteReceipt { reference: string; status: "pending"; createdAt: Date; }
export interface QuotePricingItemInput { itemId: number; unitPrice: number; discountAmount?: number; }
export interface QuotePricingInput { items: QuotePricingItemInput[]; discountAmount?: number; taxRate?: number; }
export interface QuoteCommercialDetailsInput { currency?: QuoteCurrency; validUntil?: string | null; paymentTerms?: string | null; commercialNotes?: string | null; internalNotes?: string | null; }
export interface QuoteRejectionInput { reason?: string | null; }

export interface QuoteCustomerView { name: string; companyName: string | null; email: string; phone: string; ruc?: string | null; jobTitle?: string | null; location?: string | null; }
export interface QuoteItemView { id: number; productId: number; productName: string; quantity: number; customerNotes: string | null; unitPrice?: number | null; discountAmount?: number; subtotal?: number | null; }
export interface QuoteCommercialView { subtotal: number | null; discountAmount: number; taxRate: number; taxAmount: number | null; total: number | null; currency: QuoteCurrency; validUntil: string | null; paymentTerms: string | null; commercialNotes: string | null; internalNotes: string | null; pricedBy: number | null; pricedAt: Date | null; sentAt: Date | null; }
export interface QuotePermissions { canReview: boolean; canPrice: boolean; canEditCommercial: boolean; canPrepare: boolean; canReject: boolean; }
export interface AdminQuoteListItem { access: QuoteAdminAccess; id: number; reference: string; status: QuoteStatus; createdAt: Date; customer: QuoteCustomerView; itemCount: number; }
export interface AdminQuoteDetail extends AdminQuoteListItem { updatedAt: Date; customerNotes: string | null; items: QuoteItemView[]; commercial?: QuoteCommercialView; permissions: QuotePermissions; }
export interface QuoteHistoryEvent { id: number; quoteId: number; actorAdminId: number | null; actorAdminName: string | null; eventType: QuoteEventType; fromStatus: QuoteStatus | null; toStatus: QuoteStatus | null; note: string | null; createdAt: Date; }
