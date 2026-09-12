import {
    useEffect,
    useMemo,
} from "react";

import {
    usePublicCatalog,
} from "../../products/hooks/usePublicCatalog";

import {
    useFavorites,
} from "./useFavorites";

export function useFavoriteProducts() {
    const {
        favoriteProductIds,
        favoriteCount,
        retainAvailableFavorites,
    } = useFavorites();

    const catalog = usePublicCatalog();

    const favoriteProductIdSet = useMemo(
        () => new Set(favoriteProductIds),
        [favoriteProductIds],
    );

    const favoriteProducts = useMemo(
        () =>
            catalog.products.filter((product) =>
                favoriteProductIdSet.has(product.id),
            ),
        [catalog.products, favoriteProductIdSet],
    );

    const categoryNamesById = useMemo(
        () =>
            new Map(
                catalog.categories.map((category) => [
                    category.id,
                    category.name,
                ]),
            ),
        [catalog.categories],
    );

    const availableProductIds = useMemo(
        () => catalog.products.map((product) => product.id),
        [catalog.products],
    );

    useEffect(() => {
        if (
            catalog.isLoading ||
            catalog.errorMessage ||
            favoriteCount === 0
        ) {
            return;
        }

        let isActive = true;

        queueMicrotask(() => {
            if (isActive) {
                retainAvailableFavorites(availableProductIds);
            }
        });

        return () => {
            isActive = false;
        };
    }, [
        availableProductIds,
        catalog.errorMessage,
        catalog.isLoading,
        favoriteCount,
        retainAvailableFavorites,
    ]);

    return {
        favoriteCount,
        favoriteProducts,
        categoryNamesById,
        isLoading: catalog.isLoading,
        errorMessage: catalog.errorMessage,
        reload: catalog.reload,
    };
}
