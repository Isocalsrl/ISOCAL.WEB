import {
    NavLink,
} from "react-router-dom";

import {
    useQuotation,
} from "../hooks/useQuotation";

import {
    QuotationIcon,
} from "./QuotationIcon";

interface QuotationHeaderLinkProps {
    onNavigate:
        () => void;
}

export function QuotationHeaderLink({
    onNavigate,
}: QuotationHeaderLinkProps) {
    const {
        quotationCount,
    } = useQuotation();

    return (
        <NavLink
            className={({
                isActive,
            }) =>
                isActive
                    ? "quotation-header-link quotation-header-link-active"
                    : "quotation-header-link"
            }
            to="/cotizacion"
            onClick={
                onNavigate
            }
            aria-label={`Cotización: ${quotationCount} ${
                quotationCount === 1
                    ? "producto seleccionado"
                    : "productos seleccionados"
            }`}
        >
            <QuotationIcon />

            <span className="quotation-header-label">
                Cotización
            </span>

            <span
                className="quotation-header-count"
                aria-hidden="true"
            >
                {quotationCount}
            </span>
        </NavLink>
    );
}