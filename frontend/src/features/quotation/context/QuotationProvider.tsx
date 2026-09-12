import {
    useMemo,
    type ReactNode,
} from "react";

import {
    usePersistedProductIds,
} from "../../../shared/hooks/usePersistedProductIds";

import {
    quotationProductIdStorage,
} from "../storage/quotation.storage";

import {
    QuotationContext,
    type QuotationContextValue,
} from "./quotation.context";

interface QuotationProviderProps {
    children: ReactNode;
}

export function QuotationProvider({
    children,
}: QuotationProviderProps) {
    const {
        productIds,
        count,
        has,
        add,
        remove,
        toggle,
        clear,
        retainAvailable,
    } = usePersistedProductIds(
        quotationProductIdStorage,
    );

    const value = useMemo<QuotationContextValue>(
        () => ({
            quotationProductIds: productIds,
            quotationCount: count,
            isInQuotation: has,
            addToQuotation: add,
            removeFromQuotation: remove,
            toggleQuotation: toggle,
            clearQuotation: clear,
            retainAvailableQuotationProducts: retainAvailable,
        }),
        [
            add,
            clear,
            count,
            has,
            productIds,
            remove,
            retainAvailable,
            toggle,
        ],
    );

    return (
        <QuotationContext.Provider value={value}>
            {children}
        </QuotationContext.Provider>
    );
}
