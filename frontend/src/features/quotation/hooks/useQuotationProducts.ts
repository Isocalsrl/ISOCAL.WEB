import { useEffect, useMemo } from "react";
import { usePublicCatalog } from "../../products/hooks/usePublicCatalog";
import { useQuotation } from "./useQuotation";

export function useQuotationProducts() {
    const quotation = useQuotation();
    const { quotationCount, retainAvailableQuotationProducts } = quotation;
    const catalog = usePublicCatalog();

    const quotationProductIdSet = useMemo(
        () => new Set(quotation.quotationProductIds),
        [quotation.quotationProductIds],
    );

    const quotationProducts = useMemo(
        () => catalog.products.filter((product) => quotationProductIdSet.has(product.id)),
        [catalog.products, quotationProductIdSet],
    );

    const categoryNamesById = useMemo(
        () => new Map(catalog.categories.map((category) => [category.id, category.name])),
        [catalog.categories],
    );

    const availableProductIds = useMemo(
        () => catalog.products.map((product) => product.id),
        [catalog.products],
    );

    useEffect(() => {
        if (catalog.isLoading || catalog.errorMessage || quotationCount === 0) {
            return;
        }

        let isActive = true;

        queueMicrotask(() => {
            if (isActive) {
                retainAvailableQuotationProducts(availableProductIds);
            }
        });

        return () => {
            isActive = false;
        };
    }, [
        availableProductIds,
        catalog.errorMessage,
        catalog.isLoading,
        quotationCount,
        retainAvailableQuotationProducts,
    ]);

    return {
        quotationCount: quotation.quotationCount,
        quotationProducts,
        categoryNamesById,
        clearQuotation: quotation.clearQuotation,
        isLoading: catalog.isLoading,
        errorMessage: catalog.errorMessage,
        errorKind: catalog.errorKind,
        reload: catalog.reload,
    };
}

export type QuotationProductsState = ReturnType<typeof useQuotationProducts>;
