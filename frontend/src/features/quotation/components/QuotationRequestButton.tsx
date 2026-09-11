import {
    useState,
} from "react";

import {
    QuotationIcon,
} from "./QuotationIcon";

export function QuotationRequestButton() {
    const [
        hasInteracted,
        setHasInteracted,
    ] = useState(false);

    return (
        <button
            className={
                hasInteracted
                    ? "quotation-request-button quotation-request-button-feedback"
                    : "quotation-request-button"
            }
            type="button"
            onClick={() => {
                setHasInteracted(
                    true,
                );
            }}
        >
            <QuotationIcon />

            <span
                aria-live="polite"
            >
                {hasInteracted
                    ? "Envío próximamente"
                    : "Solicitar cotización"}
            </span>
        </button>
    );
}