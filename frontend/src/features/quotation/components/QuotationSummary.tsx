import {
    QuotationRequestButton,
} from "./QuotationRequestButton";

interface QuotationSummaryProps {
    productCount:
        number;

    onClear:
        () => void;
}

export function QuotationSummary({
    productCount,
    onClear,
}: QuotationSummaryProps) {
    return (
        <aside className="quotation-summary">
            <p className="eyebrow">
                Resumen
            </p>

            <h2>
                Solicitud de cotización
            </h2>

            <div className="quotation-summary-count">
                <span>
                    Productos seleccionados
                </span>

                <strong>
                    {
                        productCount
                    }
                </strong>
            </div>

            <p className="quotation-summary-description">
                Revisa los productos seleccionados antes de preparar tu solicitud comercial.
            </p>

            <QuotationRequestButton />

            <p className="quotation-summary-note">
                El envío automático de la solicitud se habilitará en una siguiente etapa.
            </p>

            <button
                className="quotation-clear-button"
                type="button"
                onClick={
                    onClear
                }
            >
                Vaciar lista
            </button>
        </aside>
    );
}