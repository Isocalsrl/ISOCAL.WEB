import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError } from "../../../shared/api/httpClient";
import * as categoriesApi
    from "../../categories/api/categories.api";
import type { Category } from "../../categories/types/category.types";
import * as productsApi
    from "../api/products.api";
import type { Product } from "../types/product.types";

async function fetchProductsData(): Promise<{
    products: Product[];
    categories: Category[];
}> {
    const [
        products,
        categories,
    ] = await Promise.all([
        productsApi.listProducts(),
        categoriesApi.listCategories(),
    ]);

    return {
        products,
        categories,
    };
}

function getLoadErrorMessage(
    error:
        unknown,
): string {
    return error instanceof ApiError
        ? error.message
        : "No se pudo cargar el listado de productos.";
}

export function useProductsCollection() {
    const [
        products,
        setProducts,
    ] = useState<Product[]>([]);

    const [
        categories,
        setCategories,
    ] = useState<Category[]>([]);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        loadErrorMessage,
        setLoadErrorMessage,
    ] = useState<string | null>(
        null,
    );

    const loadData =
        useCallback(
            async (): Promise<void> => {
                setLoadErrorMessage(
                    null,
                );
                setIsLoading(true);

                try {
                    const data =
                        await fetchProductsData();

                    setProducts(
                        data.products,
                    );
                    setCategories(
                        data.categories,
                    );
                } catch (error) {
                    setLoadErrorMessage(
                        getLoadErrorMessage(
                            error,
                        ),
                    );
                } finally {
                    setIsLoading(false);
                }
            },
            [],
        );

    useEffect(() => {
        let isActive = true;

        void fetchProductsData()
            .then((data) => {
                if (!isActive) {
                    return;
                }

                setLoadErrorMessage(
                    null,
                );
                setProducts(
                    data.products,
                );
                setCategories(
                    data.categories,
                );
            })
            .catch((error: unknown) => {
                if (isActive) {
                    setLoadErrorMessage(
                        getLoadErrorMessage(
                            error,
                        ),
                    );
                }
            })
            .finally(() => {
                if (isActive) {
                    setIsLoading(false);
                }
            });

        return () => {
            isActive = false;
        };
    }, []);

    const categoryNames =
        useMemo(
            () =>
                new Map(
                    categories.map(
                        (
                            category,
                        ) => [
                            category.id,
                            category.name,
                        ],
                    ),
                ),
            [
                categories,
            ],
        );

    function replaceProduct(
        product:
            Product,
    ): void {
        setProducts(
            (
                currentProducts,
            ) =>
                currentProducts.map(
                    (
                        currentProduct,
                    ) =>
                        currentProduct.id ===
                        product.id
                            ? product
                            : currentProduct,
                ),
        );
    }

    function removeProduct(
        productId:
            number,
    ): void {
        setProducts(
            (
                currentProducts,
            ) =>
                currentProducts.filter(
                    (
                        product,
                    ) =>
                        product.id !==
                        productId,
                ),
        );
    }

    return {
        products,
        categoryNames,
        isLoading,
        loadErrorMessage,
        loadData,
        replaceProduct,
        removeProduct,
    };
}
