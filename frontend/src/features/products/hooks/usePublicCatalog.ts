import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    ApiError,
} from "../../../shared/api/httpClient";

import {
    listPublicCategories,
} from "../../categories/api/publicCategories.api";

import type {
    PublicCategory,
} from "../../categories/types/category.types";

import {
    listPublicProducts,
} from "../api/publicProducts.api";

import type {
    PublicProduct,
} from "../types/product.types";

interface PublicCatalogState {
    products:
        PublicProduct[];

    categories:
        PublicCategory[];

    isLoading:
        boolean;

    errorMessage:
        string | null;

    reload:
        () => void;
}

export function usePublicCatalog():
    PublicCatalogState {
    const [
        products,
        setProducts,
    ] = useState<
        PublicProduct[]
    >([]);

    const [
        categories,
        setCategories,
    ] = useState<
        PublicCategory[]
    >([]);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<
        string | null
    >(null);

    const [
        reloadKey,
        setReloadKey,
    ] = useState(0);

    const reload =
        useCallback(
            (): void => {
                setReloadKey(
                    (
                        currentValue,
                    ) =>
                        currentValue +
                        1,
                );
            },
            [],
        );

    useEffect(() => {
        let isActive =
            true;

        queueMicrotask(() => {
            if (!isActive) {
                return;
            }

            setIsLoading(true);
            setErrorMessage(null);
        });

        void Promise.all([
            listPublicProducts(),
            listPublicCategories(),
        ])
            .then(
                ([
                    nextProducts,
                    nextCategories,
                ]) => {
                    if (
                        !isActive
                    ) {
                        return;
                    }

                    setProducts(
                        nextProducts,
                    );

                    setCategories(
                        nextCategories,
                    );
                },
            )
            .catch(
                (
                    error:
                        unknown,
                ) => {
                    if (
                        !isActive
                    ) {
                        return;
                    }

                    setErrorMessage(
                        error instanceof
                            ApiError
                            ? error.message
                            : "No se pudo cargar el catálogo de productos.",
                    );
                },
            )
            .finally(() => {
                if (
                    isActive
                ) {
                    setIsLoading(
                        false,
                    );
                }
            });

        return () => {
            isActive =
                false;
        };
    }, [
        reloadKey,
    ]);

    return {
        products,
        categories,
        isLoading,
        errorMessage,
        reload,
    };
}
