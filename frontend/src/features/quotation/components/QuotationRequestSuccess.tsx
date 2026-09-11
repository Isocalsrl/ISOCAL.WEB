import { Link } from "react-router-dom";
import type { QuoteRequestReceipt } from "../types/quoteRequest.types";

interface QuotationRequestSuccessProps {
    receipt: QuoteRequestReceipt;
}

function formatCreatedAt(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("es-PE", { dateStyle: "long", timeStyle: "short" }).format(date);
}

export function QuotationRequestSuccess({ receipt }: QuotationRequestSuccessProps) {
    return (
        <div className="quotation-request-success" role="status" aria-live="polite">
            <p className="eyebrow">Solicitud registrada</p>
            <h2>ISOCAL recibió tu solicitud.</h2>
            <p>El equipo podrá revisarla y preparar posteriormente la información comercial. Guarda la referencia para identificarla.</p>
            <dl className="quotation-request-receipt">
                <div><dt>Referencia</dt><dd>{receipt.reference}</dd></div>
                <div><dt>Estado</dt><dd>Pendiente de revisión</dd></div>
                <div><dt>Registrada</dt><dd>{formatCreatedAt(receipt.createdAt)}</dd></div>
            </dl>
            <Link className="ui-button ui-button-primary" to="/productos">Volver al catálogo</Link>
        </div>
    );
}
