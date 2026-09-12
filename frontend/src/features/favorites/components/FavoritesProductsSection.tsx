import {
    Link,
} from "react-router-dom";

import {
    SectionState,
} from "../../../shared/components/ui/SectionState";

import {
    PublicProductCard,
} from "../../products/components/public/PublicProductCard";

import type {
    PublicProduct,
} from "../../products/types/product.types";

interface FavoritesProductsSectionProps {
    favoriteCount: number;
    products: readonly PublicProduct[];
    categoryNamesById: ReadonlyMap<number, string>;
    isLoading: boolean;
    errorMessage: string | null;
    onReload: () => void;
    onOpenProduct: (productId: number) => void;
}

export function FavoritesProductsSection({
    favoriteCount,
    products,
    categoryNamesById,
    isLoading,
    errorMessage,
    onReload,
    onOpenProduct,
}: FavoritesProductsSectionProps) {
    return (
        <section
            className="favorites-section"
            aria-labelledby="favorites-title"
        >
            <div className="public-container">
                <div className="favorites-heading">
                    <div>
                        <p className="eyebrow">Favoritos</p>
                        <h2 id="favorites-title">Productos guardados</h2>
                    </div>

                    <p className="favorites-count" aria-live="polite">
                        <strong>{favoriteCount}</strong>{" "}
                        {favoriteCount === 1
                            ? "producto guardado"
                            : "productos guardados"}
                    </p>
                </div>

                {favoriteCount === 0 ? (
                    <div className="favorites-empty">
                        <h3>Todavía no guardaste productos.</h3>
                        <p>
                            Explora el catálogo y utiliza el corazón de cada
                            producto para crear tu selección de favoritos.
                        </p>
                        <Link
                            className="ui-button ui-button-primary"
                            to="/productos"
                        >
                            Explorar catálogo
                        </Link>
                    </div>
                ) : isLoading ? (
                    <div className="favorites-state">
                        <SectionState
                            title="Cargando favoritos"
                            description="Estamos consultando la información actual de tus productos guardados."
                            isLoading
                        />
                    </div>
                ) : errorMessage ? (
                    <div className="favorites-state">
                        <SectionState
                            title="No pudimos cargar tus favoritos"
                            description={errorMessage}
                            actionLabel="Intentar nuevamente"
                            onAction={onReload}
                        />
                    </div>
                ) : (
                    <div className="catalog-products-grid favorites-products-grid">
                        {products.map((product) => (
                            <PublicProductCard
                                key={product.id}
                                product={product}
                                categoryName={
                                    product.categoryId === null
                                        ? "Sin categoría"
                                        : categoryNamesById.get(
                                              product.categoryId,
                                          ) ?? "Categoría"
                                }
                                opensDialog={false}
                                onOpen={onOpenProduct}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
