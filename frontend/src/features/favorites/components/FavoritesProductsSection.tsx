import { FavoritesSkeleton, PublicStatePanel } from "../../../shared/components/feedback";
import { PublicProductCard } from "../../products/components/public/PublicProductCard";
import type { PublicCatalogErrorKind } from "../../products/hooks/usePublicCatalog";
import type { PublicProduct } from "../../products/types/product.types";

interface FavoritesProductsSectionProps {
    favoriteCount: number;
    products: readonly PublicProduct[];
    categoryNamesById: ReadonlyMap<number, string>;
    isLoading: boolean;
    errorMessage: string | null;
    errorKind: PublicCatalogErrorKind | null;
    onReload: () => void;
    onOpenProduct: (productId: number) => void;
}

export function FavoritesProductsSection({
    favoriteCount,
    products,
    categoryNamesById,
    isLoading,
    errorMessage,
    errorKind,
    onReload,
    onOpenProduct,
}: FavoritesProductsSectionProps) {
    return (
        <section className="favorites-section" aria-labelledby="favorites-title">
            <div className="public-container">
                <div className="favorites-heading">
                    <div>
                        <p className="eyebrow">Favoritos</p>
                        <h2 id="favorites-title">Productos guardados</h2>
                    </div>

                    <p className="favorites-count" aria-live="polite">
                        <strong>{favoriteCount}</strong>{" "}
                        {favoriteCount === 1 ? "producto guardado" : "productos guardados"}
                    </p>
                </div>

                {favoriteCount === 0 ? (
                    <div className="favorites-empty">
                        <PublicStatePanel
                            variant="empty"
                            eyebrow="Tu selección"
                            title="Aún no guardaste productos"
                            description="Usa el corazón del catálogo para reunir equipos que quieras revisar más tarde. Tus favoritos se guardan en este dispositivo."
                            primaryAction={{ label: "Explorar catálogo", to: "/productos" }}
                        />
                    </div>
                ) : isLoading ? (
                    <div className="favorites-state">
                        <FavoritesSkeleton />
                    </div>
                ) : errorMessage ? (
                    <div className="favorites-state">
                        <PublicStatePanel
                            variant={errorKind === "network" ? "network" : "error"}
                            eyebrow={errorKind === "network" ? "Sin conexión" : "Favoritos no disponibles"}
                            title={errorKind === "network" ? "No pudimos cargar tus favoritos" : "No pudimos recuperar tus productos guardados"}
                            description={errorMessage}
                            primaryAction={{ label: "Volver a intentar", onClick: onReload }}
                            secondaryAction={{ label: "Ir al catálogo", to: "/productos" }}
                        />
                    </div>
                ) : products.length === 0 ? (
                    <div className="favorites-state">
                        <PublicStatePanel
                            variant="info"
                            eyebrow="Lista actualizada"
                            title="Tus productos guardados ya no están publicados"
                            description="Actualizamos tu lista para mostrar solo productos disponibles en el catálogo actual."
                            primaryAction={{ label: "Explorar catálogo", to: "/productos" }}
                        />
                    </div>
                ) : (
                    <div className="catalog-products-grid favorites-products-grid ix-content-enter">
                        {products.map((product) => (
                            <PublicProductCard
                                key={product.id}
                                product={product}
                                categoryName={
                                    product.categoryId === null
                                        ? "Sin categoría"
                                        : categoryNamesById.get(product.categoryId) ?? "Categoría"
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
