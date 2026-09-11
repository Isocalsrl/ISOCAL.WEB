import { QuotationRequestButton } from "./QuotationRequestButton";

interface QuotationSummaryProps {
    productCount: number;
    isRequestOpen: boolean;
    onRequest: () => void;
    onClear: () => void;
}

export function QuotationSummary({ productCount, isRequestOpen, onRequest, onClear }: QuotationSummaryProps) {
    return (
        <aside className="quotation-summary">
            <p className="eyebrow">Resumen</p>
            <h2>Solicitud de cotización</h2>
            <div className="quotation-summary-count">
                <span>Productos seleccionados</span>
                <strong>{productCount}</strong>
            </div>
            <p className="quotation-summary-description">Indica tus datos, cantidades y observaciones para registrar la solicitud.</p>
            <QuotationRequestButton onRequest={onRequest} disabled={isRequestOpen} />
            <p className="quotation-summary-note">La solicitud quedará pendiente de revisión por el equipo de ISOCAL.</p>
            <button className="quotation-clear-button" type="button" onClick={onClear}>Vaciar lista</button>
        </aside>
    );
}
