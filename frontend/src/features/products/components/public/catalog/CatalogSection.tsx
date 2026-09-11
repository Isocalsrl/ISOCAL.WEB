import {
    SectionState,
} from "../../../../../shared/components/ui/SectionState";

import type {
    PublicCategory,
} from "../../../../categories/types/category.types";

import type {
    PublicProduct,
} from "../../../types/product.types";

import {
    CatalogCategoryFilter,
} from "../CatalogCategoryFilter";

import {
    CatalogProductResults,
} from "./CatalogProductResults";

import {
    CatalogToolbar,
} from "./CatalogToolbar";

interface CatalogSectionProps {
    products:
        readonly PublicProduct[];

    categories:
        readonly PublicCategory[];

    filteredProducts:
        readonly PublicProduct[];

    selectedCategory:
        PublicCategory | null;

    categoryNamesById:
        ReadonlyMap<
            number,
            string
        >;

    searchTerm:
        string;

    resultLabel:
        string;

    hasSearch:
        boolean;

    isLoading:
        boolean;

    errorMessage:
        string | null;

    onReload:
        () => void;

    onSelectCategory:
        (
            categorySlug:
                string | null,
        ) => void;

    onSearchChange:
        (
            value:
                string,
        ) => void;

    onOpenProduct:
        (
            productId:
                number,
        ) => void;
}

export function CatalogSection({
    products,
    categories,
    filteredProducts,
    selectedCategory,
    categoryNamesById,
    searchTerm,
    resultLabel,
    hasSearch,
    isLoading,
    errorMessage,
    onReload,
    onSelectCategory,
    onSearchChange,
    onOpenProduct,
}: CatalogSectionProps) {
    function resetFilters(): void {
        if (
            hasSearch
        ) {
            onSearchChange(
                "",
            );
            return;
        }

        onSelectCategory(
            null,
        );
    }

    return (
        <section
            id="catalogo"
            className="catalog-section"
            aria-labelledby="catalog-title"
        >
            <div className="public-container">
                <div className="catalog-heading">
                    <div>
                        <p className="eyebrow">
                            Catálogo
                            disponible
                        </p>

                        <h2 id="catalog-title">
                            {
                                selectedCategory
                                    ? selectedCategory.name
                                    : "Todos los productos"
                            }
                        </h2>
                    </div>

                    <div className="catalog-heading-meta">
                        <strong>
                            {
                                resultLabel
                            }
                        </strong>

                        <p>
                            {
                                selectedCategory
                                    ?.description ??
                                "Filtra por categoría o busca directamente por el nombre del equipo."
                            }
                        </p>
                    </div>
                </div>

                {
                    isLoading && (
                        <div className="catalog-state">
                            <SectionState
                                title="Cargando catálogo"
                                description="Estamos consultando los productos y categorías disponibles."
                                isLoading
                            />
                        </div>
                    )
                }

                {
                    !isLoading &&
                    errorMessage && (
                        <div className="catalog-state">
                            <SectionState
                                title="No pudimos cargar el catálogo"
                                description={
                                    errorMessage
                                }
                                actionLabel="Intentar nuevamente"
                                onAction={
                                    onReload
                                }
                            />
                        </div>
                    )
                }

                {
                    !isLoading &&
                    !errorMessage && (
                        <div className="catalog-layout">
                            <aside className="catalog-sidebar">
                                <CatalogCategoryFilter
                                    categories={
                                        categories
                                    }
                                    products={
                                        products
                                    }
                                    selectedCategorySlug={
                                        selectedCategory
                                            ?.slug ??
                                        null
                                    }
                                    onSelectCategory={
                                        onSelectCategory
                                    }
                                />
                            </aside>

                            <div className="catalog-main">
                                <CatalogToolbar
                                    searchTerm={
                                        searchTerm
                                    }
                                    resultLabel={
                                        resultLabel
                                    }
                                    hasSearch={
                                        hasSearch
                                    }
                                    onSearchChange={
                                        onSearchChange
                                    }
                                    onClearSearch={() => {
                                        onSearchChange(
                                            "",
                                        );
                                    }}
                                />

                                <CatalogProductResults
                                    products={
                                        filteredProducts
                                    }
                                    categoryNamesById={
                                        categoryNamesById
                                    }
                                    hasSearch={
                                        hasSearch
                                    }
                                    onOpenProduct={
                                        onOpenProduct
                                    }
                                    onReset={
                                        resetFilters
                                    }
                                />
                            </div>
                        </div>
                    )
                }
            </div>
        </section>
    );
}
