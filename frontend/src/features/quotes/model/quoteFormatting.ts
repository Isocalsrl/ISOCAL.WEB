import type { QuoteStatus } from "../types/quote.types";
export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = { pending: "Pendiente", in_review: "En revisión", priced: "Valorizada", ready_to_send: "Lista para envío", sent: "Enviada", rejected: "Rechazada" };
export function formatMoney(value: number | null | undefined): string { return value == null ? "—" : new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(value); }
export function formatDate(value: string): string { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short" }).format(date); }
