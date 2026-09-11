import {
    useQuotation,
} from "../hooks/useQuotation";

import {
    QuotationIcon,
} from "./QuotationIcon";

interface QuotationToggleButtonProps {
    productId:
        number;

    productName:
        string;

    className?:
        string;

    activeLabel?:
        string;

    inactiveLabel?:
        string;
}

export function QuotationToggleButton({
    productId,
    productName,
    className = "",
    activeLabel =
        "En cotización",
    inactiveLabel =
        "Agregar a cotización",
}: QuotationToggleButtonProps) {
    const {
        isInQuotation,
        toggleQuotation,
    } = useQuotation();

    const selected =
        isInQuotation(
            productId,
        );

    const actionLabel =
        selected
            ? `Quitar ${productName} de la cotización`
            : `Agregar ${productName} a la cotización`;

    return (
        <button
            className={[
                "quotation-toggle",

                selected
                    ? "quotation-toggle-active"
                    : "",

                className,
            ]
                .filter(Boolean)
                .join(" ")}
            type="button"
            aria-label={
                actionLabel
            }
            aria-pressed={
                selected
            }
            onClick={() => {
                toggleQuotation(
                    productId,
                );
            }}
        >
            <QuotationIcon />

            <span className="quotation-toggle-label">
                {selected
                    ? activeLabel
                    : inactiveLabel}
            </span>
        </button>
    );
}