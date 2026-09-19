import { CatalogSkeleton, PublicStatePanel } from "../../../../../shared/components/feedback";
import type { PublicCategory } from "../../../../categories/types/category.types";
import type { PublicCatalogErrorKind } from "../../../hooks/usePublicCatalog";
import type { PublicProduct } from "../../../types/product.types";
import { CatalogCategoryFilter } from "../CatalogCategoryFilter";
import { CatalogCategoryShowcase } from "./CatalogCategoryShowcase";
import { CatalogHeading } from "./CatalogHeading";
import { CatalogProductResults } from "./CatalogProductResults";
import { CatalogToolbar } from "./CatalogToolbar";

interface CatalogSectionProps {
    products: readonly PublicProduct[];
    categories: readonly PublicCategory[];
    filteredProducts: readonly PublicProduct[];
    selectedCategory: PublicCategory | null;
    categoryNamesById: ReadonlyMap<number, string>;
    searchTerm: string;
    resultLabel: string;
    hasSearch: boolean;
    isLoading: boolean;
    errorMessage: string | null;
    errorKind: PublicCatalogErrorKind | null;
    onReload: () => void;
    onSelectCategory: (categorySlug: string | null) => void;
    onSearchChange: (value: string) => void;
    onOpenProduct: (productId: number) => void;
}

export function CatalogSection(props: CatalogSectionProps) {
    const {
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
        errorKind,
        onReload,
        onSelectCategory,
        onSearchChange,
        onOpenProduct,
    } = props;

    const resetFilters = () =>
        hasSearch ? onSearchChange("") : onSelectCategory(null);

    return (
        <section id="catalogo" className="catalog-section" aria-labelledby="catalog-title">
            <div className="public-container">
                <CatalogHeading selectedCategory={selectedCategory} resultLabel={resultLabel} />

                {!isLoading && !errorMessage && categories.length > 0 && (
                    <CatalogCategoryShowcase
                        products={products}
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={onSelectCategory}
                    />
                )}

                {isLoading ? <CatalogSkeleton /> : null}

                {!isLoading && errorMessage ? (
                    <div className="catalog-state">
                        <PublicStatePanel
                            variant={errorKind === "network" ? "network" : "error"}
                            eyebrow={errorKind === "network" ? "Sin conexión" : "Catálogo temporalmente no disponible"}
                            title={errorKind === "network" ? "No pudimos conectar con el catálogo" : "No pudimos cargar el catálogo"}
                            description={errorMessage}
                            primaryAction={{ label: "Volver a intentar", onClick: onReload }}
                            secondaryAction={{ label: "Contactar a ISOCAL", to: "/contacto" }}
                        />
                    </div>
                ) : null}

                {!isLoading && !errorMessage && (
                    <div className="catalog-layout">
                        <aside className="catalog-sidebar">
                            <CatalogCategoryFilter
                                categories={categories}
                                products={products}
                                selectedCategorySlug={selectedCategory?.slug ?? null}
                                onSelectCategory={onSelectCategory}
                            />
                        </aside>

                        <div className="catalog-main">
                            <CatalogToolbar
                                searchTerm={searchTerm}
                                resultLabel={resultLabel}
                                hasSearch={hasSearch}
                                onSearchChange={onSearchChange}
                                onClearSearch={() => onSearchChange("")}
                            />

                            <CatalogProductResults
                                products={filteredProducts}
                                categoryNamesById={categoryNamesById}
                                hasSearch={hasSearch}
                                onOpenProduct={onOpenProduct}
                                onReset={resetFilters}
                            />
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
