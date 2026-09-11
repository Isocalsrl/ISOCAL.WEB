import {
    toSlug,
} from "../../../shared/utils/toSlug";

import type {
    PublicCategory,
} from "../../categories/types/category.types";

import type {
    PublicProduct,
} from "../types/product.types";

export function parseRequestedProductId(
    value: string | null,
): number | null {
    if (!value) {
        return null;
    }

    const parsedValue = Number(value);
    return Number.isInteger(parsedValue) && parsedValue > 0
        ? parsedValue
        : null;
}

export function createCategoryNamesById(
    categories: readonly PublicCategory[],
): Map<number, string> {
    return new Map(
        categories.map((category) => [category.id, category.name]),
    );
}

export function filterCatalogProducts(options: {
    products: readonly PublicProduct[];
    selectedCategory: PublicCategory | null;
    searchTerm: string;
    categoryNamesById: ReadonlyMap<number, string>;
}): PublicProduct[] {
    const normalizedSearchTerm = toSlug(options.searchTerm);

    return options.products.filter((product) => {
        if (
            options.selectedCategory &&
            product.categoryId !== options.selectedCategory.id
        ) {
            return false;
        }

        if (!normalizedSearchTerm) {
            return true;
        }

        const categoryName =
            product.categoryId === null
                ? ""
                : options.categoryNamesById.get(product.categoryId) ?? "";

        return toSlug(
            [product.name, product.description ?? "", categoryName].join(
                " ",
            ),
        ).includes(normalizedSearchTerm);
    });
}

export function getProductCategoryName(
    product: PublicProduct | null,
    categoryNamesById: ReadonlyMap<number, string>,
): string {
    if (!product) {
        return "Catálogo ISOCAL";
    }

    if (product.categoryId === null) {
        return "Sin categoría";
    }

    return categoryNamesById.get(product.categoryId) ?? "Catálogo ISOCAL";
}
