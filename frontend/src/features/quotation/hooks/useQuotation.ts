import { useContext } from "react";
import { QuotationContext } from "../context/quotation.context";

export function useQuotation() {
    const context =
        useContext(
            QuotationContext,
        );

    if (!context) {
        throw new Error(
            "useQuotation debe utilizarse dentro de QuotationProvider.",
        );
    }

    return context;
}
