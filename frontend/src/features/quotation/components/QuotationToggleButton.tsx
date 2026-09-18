import { useTransientFeedback } from "../../../shared/hooks/useTransientFeedback";
import { useQuotation } from "../hooks/useQuotation";
import { QuotationIcon } from "./QuotationIcon";

interface QuotationToggleButtonProps {
    productId: number;
    productName: string;
    className?: string;
    activeLabel?: string;
    inactiveLabel?: string;
    showText?: boolean;
}

export function QuotationToggleButton({
    productId,
    productName,
    className = "",
    activeLabel = "Añadido a cotización",
    inactiveLabel = "Agregar para cotizar",
    showText = true,
}: QuotationToggleButtonProps) {
    const { isInQuotation, toggleQuotation } = useQuotation();
    const { message, showFeedback } = useTransientFeedback();
    const selected = isInQuotation(productId);

    const actionLabel = selected
        ? `Quitar ${productName} de la cotización`
        : `Agregar ${productName} a la cotización`;

    return (
        <button
            className={[
                "quotation-toggle",
                selected ? "quotation-toggle-active" : "",
                showText ? "quotation-toggle-with-text" : "",
                message ? "selection-feedback-active" : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            type="button"
            aria-label={actionLabel}
            aria-pressed={selected}
            title={actionLabel}
            onClick={() => {
                toggleQuotation(productId);
                showFeedback(selected ? "Quitado de cotización" : "Añadido a cotización");
            }}
        >
            <QuotationIcon />

            <span className={showText ? "quotation-toggle-label" : "sr-only"}>
                {selected ? activeLabel : inactiveLabel}
            </span>

            {message ? (
                <span className="selection-feedback-message" role="status" aria-live="polite">
                    {message}
                </span>
            ) : null}
        </button>
    );
}
