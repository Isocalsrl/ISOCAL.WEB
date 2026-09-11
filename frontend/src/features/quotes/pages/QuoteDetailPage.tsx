import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError } from "../../../shared/api/httpClient";
import { Button } from "../../../shared/components/ui/Button";
import { InlineAlert } from "../../../shared/components/feedback/InlineAlert";
import { useAuth } from "../../auth/hooks/useAuth";
import { prepareQuote, rejectQuote, reviewQuote, updateCommercialDetails, updatePricing } from "../api/quotes.api";
import { QuoteCommercialEditor } from "../components/QuoteCommercialEditor";
import { QuoteCustomerPanel } from "../components/QuoteCustomerPanel";
import { QuoteHistory } from "../components/QuoteHistory";
import { QuoteItemsPanel } from "../components/QuoteItemsPanel";
import { QuotePricingEditor } from "../components/QuotePricingEditor";
import { QuoteStatusBadge } from "../components/QuoteStatusBadge";
import { formatDate, formatMoney } from "../model/quoteFormatting";
import { useQuoteDetail } from "../hooks/useQuoteDetail";
import type { CommercialDetailsInput, PricingInput } from "../types/quote.types";
import "../styles/quotes.css";

export function QuoteDetailPage() {
    const { quoteId } = useParams(); const id = Number(quoteId); const { admin } = useAuth(); const { quote, history, isLoading, errorMessage, reload, setQuote } = useQuoteDetail(id); const [actionError, setActionError] = useState<string | null>(null); const [isSaving, setIsSaving] = useState(false);
    if (!Number.isInteger(id) || id <= 0) return <div className="management-page"><InlineAlert>Cotización no válida.</InlineAlert></div>;
    if (isLoading) return <div className="management-page"><p>Cargando cotización...</p></div>;
    if (errorMessage || !quote) return <div className="management-page"><InlineAlert>{errorMessage ?? "Cotización no encontrada."}</InlineAlert><Link className="ui-button ui-button-secondary" to="/admin/quotes">Volver</Link></div>;
    const run = async (operation: () => Promise<typeof quote>) => { setActionError(null); setIsSaving(true); try { setQuote(await operation()); } catch (error) { setActionError(error instanceof ApiError ? error.message : "No se pudo actualizar la cotización."); } finally { setIsSaving(false); } };
    const canSuper = admin?.role === "super_admin";
    return <div className="management-page"><header className="quote-detail-header"><div><Link to="/admin/quotes">← Cotizaciones</Link><p className="eyebrow">Solicitud {quote.reference}</p><h1>{quote.reference}</h1><p>Registrada el {formatDate(quote.createdAt)}</p></div><QuoteStatusBadge status={quote.status} /></header>{actionError && <InlineAlert>{actionError}</InlineAlert>}<div className="quote-detail-actions">{quote.permissions.canReview && <Button type="button" isLoading={isSaving} onClick={() => run(() => reviewQuote(id))}>Iniciar revisión</Button>}{canSuper && quote.permissions.canPrepare && <Button type="button" isLoading={isSaving} onClick={() => run(() => prepareQuote(id))}>Preparar envío</Button>}{canSuper && quote.permissions.canReject && <Button type="button" variant="danger" isLoading={isSaving} onClick={() => run(() => rejectQuote(id, "Rechazada desde el panel administrativo"))}>Rechazar</Button>}<Button type="button" variant="secondary" onClick={reload}>Actualizar</Button></div><div className="quote-detail-grid"><QuoteCustomerPanel customer={quote.customer} notes={quote.customerNotes} /><QuoteItemsPanel items={quote.items} showPricing={canSuper} /></div>{canSuper && quote.commercial && <><QuotePricingEditor key={`pricing-${quote.updatedAt}`} items={quote.items} discountAmount={quote.commercial.discountAmount} taxRate={quote.commercial.taxRate} isSaving={isSaving} onSave={async (input: PricingInput) => { await run(() => updatePricing(id, input)); }} /><QuoteCommercialEditor key={`commercial-${quote.updatedAt}`} commercial={quote.commercial} isSaving={isSaving} onSave={async (input: CommercialDetailsInput) => { await run(() => updateCommercialDetails(id, input)); }} /><section className="quote-panel quote-totals"><h2>Resumen económico</h2><p>Subtotal: <strong>{formatMoney(quote.commercial.subtotal)}</strong></p><p>Descuento: <strong>{formatMoney(quote.commercial.discountAmount)}</strong></p><p>Impuestos: <strong>{formatMoney(quote.commercial.taxAmount)}</strong></p><p>Total: <strong>{formatMoney(quote.commercial.total)}</strong></p></section><QuoteHistory events={history} /></>}</div>;
}
