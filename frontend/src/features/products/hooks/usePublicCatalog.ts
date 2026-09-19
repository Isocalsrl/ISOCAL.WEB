import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../../../shared/api/httpClient";
import { listPublicCategories } from "../../categories/api/publicCategories.api";
import type { PublicCategory } from "../../categories/types/category.types";
import { listPublicProducts } from "../api/publicProducts.api";
import type { PublicProduct } from "../types/product.types";

export type PublicCatalogErrorKind = "network" | "generic";

interface PublicCatalogState {
    products: PublicProduct[];
    categories: PublicCategory[];
    isLoading: boolean;
    errorMessage: string | null;
    errorKind: PublicCatalogErrorKind | null;
    reload: () => void;
}

export function usePublicCatalog(): PublicCatalogState {
    const [products, setProducts] = useState<PublicProduct[]>([]);
    const [categories, setCategories] = useState<PublicCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [errorKind, setErrorKind] = useState<PublicCatalogErrorKind | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    const reload = useCallback((): void => {
        setReloadKey((currentValue) => currentValue + 1);
    }, []);

    useEffect(() => {
        let isActive = true;

        queueMicrotask(() => {
            if (!isActive) return;
            setIsLoading(true);
            setErrorMessage(null);
            setErrorKind(null);
        });

        void Promise.all([
            listPublicProducts(),
            listPublicCategories(),
        ])
            .then(([nextProducts, nextCategories]) => {
                if (!isActive) return;
                setProducts(nextProducts);
                setCategories(nextCategories);
            })
            .catch((error: unknown) => {
                if (!isActive) return;

                const isNetworkError =
                    error instanceof ApiError &&
                    (error.status === 0 || error.code === "NETWORK_ERROR");

                setErrorKind(isNetworkError ? "network" : "generic");
                setErrorMessage(
                    isNetworkError
                        ? "No pudimos conectar con el servidor. Revisa tu conexión y vuelve a intentarlo."
                        : error instanceof ApiError
                          ? error.message
                          : "El catálogo no está disponible en este momento.",
                );
            })
            .finally(() => {
                if (isActive) setIsLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, [reloadKey]);

    return {
        products,
        categories,
        isLoading,
        errorMessage,
        errorKind,
        reload,
    };
}
