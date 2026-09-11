import {
    useCallback,
    useMemo,
    useState,
} from "react";

import {
    useSearchParams,
} from "react-router-dom";

import {
    toSlug,
} from "../../../shared/utils/toSlug";

import type {
    PublicCategory,
} from "../../categories/types/category.types";

import type {
    PublicProduct,
} from "../types/product.types";

function parseRequestedProductId(
    value:
        string | null,
): number | null {
    if (!value) {
        return null;
    }

    const parsedValue =
        Number(
            value,
        );

    return Number.isInteger(
        parsedValue,
    ) &&
        parsedValue > 0
        ? parsedValue
        : null;
}

export function useCatalogView(
    products:
        readonly PublicProduct[],
    categories:
        readonly PublicCategory[],
) {
    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const requestedCategorySlug =
        searchParams.get(
            "categoria",
        );

    const requestedProductId =
        parseRequestedProductId(
            searchParams.get(
                "producto",
            ),
        );

    const selectedCategory =
        useMemo(
            () =>
                categories.find(
                    (
                        category,
                    ) =>
                        category.slug ===
                        requestedCategorySlug,
                ) ?? null,
            [
                categories,
                requestedCategorySlug,
            ],
        );

    const categoryNamesById =
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

    const normalizedSearchTerm =
        toSlug(
            searchTerm,
        );

    const filteredProducts =
        useMemo(
            () =>
                products.filter(
                    (
                        product,
                    ) => {
                        if (
                            selectedCategory &&
                            product.categoryId !==
                                selectedCategory.id
                        ) {
                            return false;
                        }

                        if (
                            !normalizedSearchTerm
                        ) {
                            return true;
                        }

                        const categoryName =
                            product.categoryId ===
                            null
                                ? ""
                                : categoryNamesById.get(
                                      product.categoryId,
                                  ) ?? "";

                        return toSlug(
                            [
                                product.name,
                                product.description ??
                                    "",
                                categoryName,
                            ].join(
                                " ",
                            ),
                        ).includes(
                            normalizedSearchTerm,
                        );
                    },
                ),
            [
                products,
                selectedCategory,
                normalizedSearchTerm,
                categoryNamesById,
            ],
        );

    const selectedProduct =
        useMemo(
            () =>
                products.find(
                    (
                        product,
                    ) =>
                        product.id ===
                        requestedProductId,
                ) ?? null,
            [
                products,
                requestedProductId,
            ],
        );

    const selectedProductCategoryName =
        selectedProduct
            ?.categoryId ===
        null
            ? "Sin categoría"
            : categoryNamesById.get(
                  selectedProduct
                      ?.categoryId ??
                      -1,
              ) ??
              "Catálogo ISOCAL";

    const selectCategory =
        useCallback(
            (
                categorySlug:
                    string | null,
            ): void => {
                const nextSearchParams =
                    new URLSearchParams(
                        searchParams,
                    );

                nextSearchParams.delete(
                    "producto",
                );

                if (
                    categorySlug
                ) {
                    nextSearchParams.set(
                        "categoria",
                        categorySlug,
                    );
                } else {
                    nextSearchParams.delete(
                        "categoria",
                    );
                }

                setSearchParams(
                    nextSearchParams,
                );
            },
            [
                searchParams,
                setSearchParams,
            ],
        );

    const openProduct =
        useCallback(
            (
                productId:
                    number,
            ): void => {
                const nextSearchParams =
                    new URLSearchParams(
                        searchParams,
                    );

                nextSearchParams.set(
                    "producto",
                    String(
                        productId,
                    ),
                );

                setSearchParams(
                    nextSearchParams,
                );
            },
            [
                searchParams,
                setSearchParams,
            ],
        );

    const closeProduct =
        useCallback(
            (): void => {
                const nextSearchParams =
                    new URLSearchParams(
                        searchParams,
                    );

                nextSearchParams.delete(
                    "producto",
                );

                setSearchParams(
                    nextSearchParams,
                    {
                        replace:
                            true,
                    },
                );
            },
            [
                searchParams,
                setSearchParams,
            ],
        );

    const resultLabel =
        filteredProducts.length ===
        1
            ? "1 producto"
            : `${filteredProducts.length} productos`;

    const hasSearch =
        searchTerm
            .trim()
            .length >
        0;

    return {
        searchTerm,
        setSearchTerm,
        selectedCategory,
        selectedProduct,
        selectedProductCategoryName,
        categoryNamesById,
        filteredProducts,
        resultLabel,
        hasSearch,
        selectCategory,
        openProduct,
        closeProduct,
    };
}
