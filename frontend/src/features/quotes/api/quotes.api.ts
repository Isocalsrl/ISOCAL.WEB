import { request } from "../../../shared/api/httpClient";
import type { CommercialDetailsInput, PricingInput, QuoteDetail, QuoteHistoryEvent, QuoteListItem, QuoteStatus } from "../types/quote.types";
const BASE_PATH = "/api/admin/quotes";
export function listQuotes(status?: QuoteStatus): Promise<QuoteListItem[]> { return request<QuoteListItem[]>(status ? `${BASE_PATH}?status=${encodeURIComponent(status)}` : BASE_PATH); }
export function getQuote(id: number): Promise<QuoteDetail> { return request<QuoteDetail>(`${BASE_PATH}/${id}`); }
export function reviewQuote(id: number): Promise<QuoteDetail> { return request<QuoteDetail>(`${BASE_PATH}/${id}/review`, { method: "POST" }); }
export function updatePricing(id: number, body: PricingInput): Promise<QuoteDetail> { return request<QuoteDetail>(`${BASE_PATH}/${id}/pricing`, { method: "PATCH", body: JSON.stringify(body) }); }
export function updateCommercialDetails(id: number, body: CommercialDetailsInput): Promise<QuoteDetail> { return request<QuoteDetail>(`${BASE_PATH}/${id}/commercial-details`, { method: "PATCH", body: JSON.stringify(body) }); }
export function prepareQuote(id: number): Promise<QuoteDetail> { return request<QuoteDetail>(`${BASE_PATH}/${id}/prepare`, { method: "POST" }); }
export function sendQuote(id: number): Promise<QuoteDetail> { return request<QuoteDetail>(`${BASE_PATH}/${id}/send`, { method: "POST" }); }
export function resendQuote(id: number): Promise<QuoteDetail> { return request<QuoteDetail>(`${BASE_PATH}/${id}/resend`, { method: "POST" }); }
export function rejectQuote(id: number, reason?: string): Promise<QuoteDetail> { return request<QuoteDetail>(`${BASE_PATH}/${id}/reject`, { method: "POST", body: JSON.stringify({ reason }) }); }
export function getQuoteHistory(id: number): Promise<QuoteHistoryEvent[]> { return request<QuoteHistoryEvent[]>(`${BASE_PATH}/${id}/history`); }
