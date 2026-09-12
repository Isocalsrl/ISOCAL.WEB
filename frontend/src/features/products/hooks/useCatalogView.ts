import {
    useMemo,
    useState,
} from "react";

import type {
    PublicCategory,
} from "../../categories/types/category.types";

import {
    createCategoryNamesById,
    filterCatalogProducts,
    getProductCategoryName,
} from "../model/catalogFilters";

import type {
    PublicProduct,
} from "../types/product.types";

import {
    useCatalogQueryParams,
} from "./useCatalogQueryParams";

export function useCatalogView(
    products: readonly PublicProduct[],
    categories: readonly PublicCategory[],
) {
    const [searchTerm, setSearchTerm] = useState("");
    const query = useCatalogQueryParams();

    const selectedCategory = useMemo(
        () =>
            categories.find(
                (category) => category.slug === query.selectedCategorySlug,
            ) ?? null,
        [categories, query.selectedCategorySlug],
    );

    const categoryNamesById = useMemo(
        () => createCategoryNamesById(categories),
        [categories],
    );

    const filteredProducts = useMemo(
        () =>
            filterCatalogProducts({
                products,
                selectedCategory,
                searchTerm,
                categoryNamesById,
            }),
        [products, selectedCategory, searchTerm, categoryNamesById],
    );

    const selectedProduct = useMemo(
        () =>
            products.find(
                (product) => product.id === query.selectedProductId,
            ) ?? null,
        [products, query.selectedProductId],
    );

    return {
        searchTerm,
        setSearchTerm,
        selectedCategory,
        selectedProduct,
        selectedProductCategoryName: getProductCategoryName(
            selectedProduct,
            categoryNamesById,
        ),
        categoryNamesById,
        filteredProducts,
        resultLabel:
            filteredProducts.length === 1
                ? "1 producto"
                : `${filteredProducts.length} productos`,
        hasSearch: searchTerm.trim().length > 0,
        selectCategory: query.selectCategory,
        openProduct: query.openProduct,
        closeProduct: query.closeProduct,
    };
}
