import { useState } from "react";
import { Link } from "react-router-dom";
import { FullPageMessage } from "../../../shared/components/feedback/FullPageMessage";
import { ManagementHeader } from "../../admin/components/ManagementHeader";
import { QuoteFilters } from "../components/QuoteFilters";
import { QuotesTable } from "../components/QuotesTable";
import type { QuoteStatus } from "../types/quote.types";
import { useQuotesCollection } from "../hooks/useQuotesCollection";
import "../styles/quotes.css";

export function QuotesPage() {
    const [status, setStatus] = useState<QuoteStatus | undefined>();
    const { quotes, isLoading, errorMessage, reload } = useQuotesCollection(status);
    return <div className="management-page"><ManagementHeader eyebrow="Cotizaciones" title="Solicitudes comerciales" description="Revisa y gestiona las solicitudes públicas recibidas." actions={<QuoteFilters value={status} onChange={setStatus} />} />{isLoading ? <FullPageMessage title="Cargando cotizaciones..." description="Estamos consultando las solicitudes recibidas." /> : errorMessage ? <FullPageMessage title="No se pudieron cargar las cotizaciones" description={errorMessage} actionLabel="Intentar nuevamente" onAction={reload} /> : quotes.length === 0 ? <FullPageMessage title="No hay cotizaciones" description="Las solicitudes recibidas aparecerán aquí." /> : <QuotesTable quotes={quotes} />}<Link className="quotes-refresh-link" to="/admin/products">Volver a productos</Link></div>;
}
