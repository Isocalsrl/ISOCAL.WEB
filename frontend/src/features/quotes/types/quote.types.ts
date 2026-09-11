export type QuoteStatus = "pending" | "in_review" | "priced" | "ready_to_send" | "sent" | "rejected";
export type QuoteEventType = "review_started" | "pricing_updated" | "commercial_details_updated" | "prepared" | "rejected" | "document_generated" | "email_sent" | "email_failed" | "email_resent";
export interface QuoteCustomer { name: string; companyName: string | null; email: string; phone: string; ruc?: string | null; jobTitle?: string | null; location?: string | null; }
export interface QuoteItem { id: number; productId: number; productName: string; quantity: number; customerNotes: string | null; unitPrice?: number | null; discountAmount?: number; subtotal?: number | null; }
export interface QuoteCommercial { subtotal: number | null; discountAmount: number; taxRate: number; taxAmount: number | null; total: number | null; currency: "PEN"; validUntil: string | null; paymentTerms: string | null; commercialNotes: string | null; internalNotes: string | null; pricedBy: number | null; pricedAt: string | null; sentAt: string | null; }
export interface QuotePermissions { canReview: boolean; canPrice: boolean; canEditCommercial: boolean; canPrepare: boolean; canReject: boolean; }
export interface QuoteListItem { access: "admin" | "super_admin"; id: number; reference: string; status: QuoteStatus; createdAt: string; customer: QuoteCustomer; itemCount: number; }
export interface QuoteDetail extends QuoteListItem { updatedAt: string; customerNotes: string | null; items: QuoteItem[]; commercial?: QuoteCommercial; permissions: QuotePermissions; }
export interface QuoteHistoryEvent { id: number; quoteId: number; actorAdminId: number | null; actorAdminName: string | null; eventType: QuoteEventType; fromStatus: QuoteStatus | null; toStatus: QuoteStatus | null; note: string | null; createdAt: string; }
export interface PricingItemInput { itemId: number; unitPrice: number; discountAmount?: number; }
export interface PricingInput { items: PricingItemInput[]; discountAmount?: number; taxRate?: number; }
export interface CommercialDetailsInput { currency?: "PEN"; validUntil?: string | null; paymentTerms?: string | null; commercialNotes?: string | null; internalNotes?: string | null; }
