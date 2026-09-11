import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError } from "../../../shared/api/httpClient";
import { InlineAlert } from "../../../shared/components/feedback/InlineAlert";
import { Button } from "../../../shared/components/ui/Button";
import { ConfirmDialog } from "../../../shared/components/ui/ConfirmDialog";
import { useAuth } from "../../auth/hooks/useAuth";
import { prepareQuote, rejectQuote, resendQuote, reviewQuote, sendQuote, updateCommercialDetails, updatePricing } from "../api/quotes.api";
import { QuoteCommercialEditor } from "../components/QuoteCommercialEditor";
import { QuoteCustomerPanel } from "../components/QuoteCustomerPanel";
import { QuoteHistory } from "../components/QuoteHistory";
import { QuoteItemsPanel } from "../components/QuoteItemsPanel";
import { QuotePricingEditor } from "../components/QuotePricingEditor";
import { QuoteStatusBadge } from "../components/QuoteStatusBadge";
import { useQuoteDetail } from "../hooks/useQuoteDetail";
import { formatDate, formatMoney } from "../model/quoteFormatting";
import type { CommercialDetailsInput, PricingInput } from "../types/quote.types";
import "../styles/quotes.css";

export function QuoteDetailPage() {
    const { quoteId } = useParams();
    const id = Number(quoteId);
    const { admin } = useAuth();
    const { quote, history, isLoading, errorMessage, reload, setQuote } = useQuoteDetail(id);
    const [actionError, setActionError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [deliveryAction, setDeliveryAction] = useState<"send" | "resend" | null>(null);

    if (!Number.isInteger(id) || id <= 0) return <div className="management-page"><InlineAlert>Cotizacion no valida.</InlineAlert></div>;
    if (isLoading) return <div className="management-page"><p>Cargando cotizacion...</p></div>;
    if (errorMessage || !quote) return <div className="management-page"><InlineAlert>{errorMessage ?? "Cotizacion no encontrada."}</InlineAlert><Link className="ui-button ui-button-secondary" to="/admin/quotes">Volver</Link></div>;

    const run = async (operation: () => Promise<typeof quote>) => {
        setActionError(null);
        setIsSaving(true);
        try {
            setQuote(await operation());
        } catch (error) {
            setActionError(error instanceof ApiError ? error.message : "No se pudo actualizar la cotizacion.");
        } finally {
            setIsSaving(false);
        }
    };
    const canSuper = admin?.role === "super_admin";
    const confirmDelivery = () => {
        if (deliveryAction === "send") {
            void run(() => sendQuote(id)).then(() => setDeliveryAction(null));
        } else if (deliveryAction === "resend") {
            void run(() => resendQuote(id)).then(() => setDeliveryAction(null));
        }
    };

    return <div className="management-page">
        <header className="quote-detail-header">
            <div><Link to="/admin/quotes">← Cotizaciones</Link><p className="eyebrow">Solicitud {quote.reference}</p><h1>{quote.reference}</h1><p>Registrada el {formatDate(quote.createdAt)}</p></div>
            <QuoteStatusBadge status={quote.status} />
        </header>
        {actionError && <InlineAlert>{actionError}</InlineAlert>}
        <div className="quote-detail-actions">
            {quote.permissions.canReview && <Button type="button" isLoading={isSaving} onClick={() => void run(() => reviewQuote(id))}>Iniciar revision</Button>}
            {canSuper && quote.permissions.canPrepare && <Button type="button" isLoading={isSaving} onClick={() => void run(() => prepareQuote(id))}>Preparar envio</Button>}
            {canSuper && quote.status === "ready_to_send" && <Button type="button" isLoading={isSaving} onClick={() => setDeliveryAction("send")}>Enviar al cliente</Button>}
            {canSuper && quote.status === "sent" && <Button type="button" variant="secondary" isLoading={isSaving} onClick={() => setDeliveryAction("resend")}>Reenviar cotizacion</Button>}
            {canSuper && quote.permissions.canReject && <Button type="button" variant="danger" isLoading={isSaving} onClick={() => void run(() => rejectQuote(id, "Rechazada desde el panel administrativo"))}>Rechazar</Button>}
            <Button type="button" variant="secondary" onClick={reload}>Actualizar</Button>
        </div>
        <div className="quote-detail-grid"><QuoteCustomerPanel customer={quote.customer} notes={quote.customerNotes} /><QuoteItemsPanel items={quote.items} showPricing={canSuper} /></div>
        {canSuper && quote.commercial && <>
            <QuotePricingEditor key={`pricing-${quote.updatedAt}`} items={quote.items} discountAmount={quote.commercial.discountAmount} taxRate={quote.commercial.taxRate} isSaving={isSaving} onSave={async (input: PricingInput) => { await run(() => updatePricing(id, input)); }} />
            <QuoteCommercialEditor key={`commercial-${quote.updatedAt}`} commercial={quote.commercial} isSaving={isSaving} onSave={async (input: CommercialDetailsInput) => { await run(() => updateCommercialDetails(id, input)); }} />
            <section className="quote-panel quote-totals"><h2>Resumen economico</h2><p>Subtotal: <strong>{formatMoney(quote.commercial.subtotal)}</strong></p><p>Descuento: <strong>{formatMoney(quote.commercial.discountAmount)}</strong></p><p>Impuestos: <strong>{formatMoney(quote.commercial.taxAmount)}</strong></p><p>Total: <strong>{formatMoney(quote.commercial.total)}</strong></p></section>
            <QuoteHistory events={history} />
        </>}
        <ConfirmDialog
            isOpen={deliveryAction !== null}
            title={deliveryAction === "resend" ? "Reenviar cotizacion" : "Enviar cotizacion"}
            description={deliveryAction === "resend" ? `Se reenviara ${quote.reference} al correo registrado del cliente: ${quote.customer.email}. Se utilizara el PDF ya preparado.` : `Se enviara ${quote.reference} al correo registrado del cliente: ${quote.customer.email}.`}
            confirmLabel={deliveryAction === "resend" ? "Reenviar" : "Enviar cotizacion"}
            isConfirming={isSaving}
            onCancel={() => setDeliveryAction(null)}
            onConfirm={confirmDelivery}
        />
    </div>;
}
