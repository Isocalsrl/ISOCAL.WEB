import { createContext } from "react";

export interface QuotationContextValue {
    quotationProductIds:
        readonly number[];

    quotationCount:
        number;

    isInQuotation:
        (
            productId:
                number,
        ) => boolean;

    addToQuotation:
        (
            productId:
                number,
        ) => void;

    removeFromQuotation:
        (
            productId:
                number,
        ) => void;

    toggleQuotation:
        (
            productId:
                number,
        ) => void;

    clearQuotation:
        () => void;

    retainAvailableQuotationProducts:
        (
            availableProductIds:
                readonly number[],
        ) => void;
}

export const QuotationContext =
    createContext<QuotationContextValue | null>(
        null,
    );
