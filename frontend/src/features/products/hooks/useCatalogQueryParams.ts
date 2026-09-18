import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { parseRequestedProductId } from "../model/catalogFilters";

export function useCatalogQueryParams() {
    const [searchParams, setSearchParams] = useSearchParams();

    const selectedCategorySlug = searchParams.get("categoria");
    const selectedProductId = parseRequestedProductId(
        searchParams.get("producto"),
    );

    const selectCategory = useCallback(
        (categorySlug: string | null): void => {
            const nextSearchParams = new URLSearchParams(searchParams);
            nextSearchParams.delete("producto");

            if (categorySlug) {
                nextSearchParams.set("categoria", categorySlug);
            } else {
                nextSearchParams.delete("categoria");
            }

            setSearchParams(nextSearchParams);
        },
        [searchParams, setSearchParams],
    );

    const openProduct = useCallback(
        (productId: number): void => {
            const nextSearchParams = new URLSearchParams(searchParams);
            nextSearchParams.set("producto", String(productId));
            setSearchParams(nextSearchParams);
        },
        [searchParams, setSearchParams],
    );

    const closeProduct = useCallback((): void => {
        const nextSearchParams = new URLSearchParams(searchParams);
        nextSearchParams.delete("producto");
        setSearchParams(nextSearchParams, { replace: true });
    }, [searchParams, setSearchParams]);

    return {
        selectedCategorySlug,
        selectedProductId,
        selectCategory,
        openProduct,
        closeProduct,
    };
}
