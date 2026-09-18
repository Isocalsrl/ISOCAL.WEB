import { useMemo } from "react";
import type { PublicCategory } from "../../../categories/types/category.types";
import type { PublicProduct } from "../../types/product.types";

interface CatalogCategoryFilterProps {
    categories:
        readonly PublicCategory[];

    products:
        readonly PublicProduct[];

    selectedCategorySlug:
        string | null;

    onSelectCategory:
        (
            categorySlug:
                string | null,
        ) => void;
}

export function CatalogCategoryFilter({
    categories,
    products,
    selectedCategorySlug,
    onSelectCategory,
}: CatalogCategoryFilterProps) {
    const productCountByCategory =
        useMemo(() => {
            const counts =
                new Map<
                    number,
                    number
                >();

            products.forEach(
                (
                    product,
                ) => {
                    if (
                        product.categoryId ===
                        null
                    ) {
                        return;
                    }

                    counts.set(
                        product.categoryId,
                        (
                            counts.get(
                                product.categoryId,
                            ) ?? 0
                        ) + 1,
                    );
                },
            );

            return counts;
        }, [
            products,
        ]);

    return (
        <nav
            className="catalog-category-filter"
            aria-label="Filtrar productos por categoría"
        >
            <p className="catalog-category-filter-title">
                Categorías
            </p>

            <button
                className={
                    selectedCategorySlug ===
                    null
                        ? "catalog-category-button catalog-category-button-active"
                        : "catalog-category-button"
                }
                type="button"
                aria-pressed={
                    selectedCategorySlug ===
                    null
                }
                aria-controls="catalog-results"
                onClick={() =>
                    onSelectCategory(
                        null,
                    )
                }
            >
                <span>
                    Todos los
                    productos
                </span>

                <strong className="catalog-category-count">
                    {products.length}
                </strong>
            </button>

            {
                categories.map(
                    (
                        category,
                    ) => (
                        <button
                            key={category.id}
                            className={
                                selectedCategorySlug ===
                                category.slug
                                    ? "catalog-category-button catalog-category-button-active"
                                    : "catalog-category-button"
                            }
                            type="button"
                            aria-pressed={
                                selectedCategorySlug ===
                                category.slug
                            }
                            aria-controls="catalog-results"
                            onClick={() =>
                                onSelectCategory(
                                    category.slug,
                                )
                            }
                        >
                            <span>
                                {category.name}
                            </span>

                            <strong className="catalog-category-count">
                                {
                                    productCountByCategory.get(
                                        category.id,
                                    ) ?? 0
                                }
                            </strong>
                        </button>
                    ),
                )
            }
        </nav>
    );
}
