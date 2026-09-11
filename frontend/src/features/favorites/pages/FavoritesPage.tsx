import {
    useEffect,
    useMemo,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    SectionState,
} from "../../../shared/components/ui/SectionState";

import {
    PageSeo,
} from "../../../shared/seo/PageSeo";

import {
    PublicProductCard,
} from "../../products/components/public/PublicProductCard";

import {
    usePublicCatalog,
} from "../../products/hooks/usePublicCatalog";

import {
    useFavorites,
} from "../hooks/useFavorites";

export function FavoritesPage() {
    const navigate =
        useNavigate();

    const {
        favoriteProductIds,
        favoriteCount,
        retainAvailableFavorites,
    } = useFavorites();

    const {
        products,
        categories,
        isLoading,
        errorMessage,
        reload,
    } = usePublicCatalog();

    const favoriteProductIdSet =
        useMemo(
            () =>
                new Set(
                    favoriteProductIds,
                ),
            [
                favoriteProductIds,
            ],
        );

    const favoriteProducts =
        useMemo(
            () =>
                products.filter(
                    (
                        product,
                    ) =>
                        favoriteProductIdSet.has(
                            product.id,
                        ),
                ),
            [
                products,
                favoriteProductIdSet,
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

    const availableProductIds =
        useMemo(
            () =>
                products.map(
                    (
                        product,
                    ) =>
                        product.id,
                ),
            [
                products,
            ],
        );

    useEffect(() => {
        if (
            isLoading ||
            errorMessage ||
            favoriteCount === 0
        ) {
            return;
        }

        let isActive =
            true;

        queueMicrotask(() => {
            if (!isActive) {
                return;
            }

            retainAvailableFavorites(
                availableProductIds,
            );
        });

        return () => {
            isActive =
                false;
        };
    }, [
        availableProductIds,
        errorMessage,
        favoriteCount,
        isLoading,
        retainAvailableFavorites,
    ]);

    return (
        <main className="public-main favorites-page">
            <PageSeo
                title="Favoritos | ISOCAL"
                description="Consulta los productos que guardaste como favoritos dentro del catálogo público de ISOCAL."
                canonicalPath="/favoritos"
            />

            <section className="favorites-hero">
                <div className="public-container favorites-hero-content">
                    <div>
                        <p className="eyebrow">
                            Selección personal
                        </p>

                        <h1>
                            Tus productos favoritos.
                        </h1>
                    </div>

                    <p className="favorites-hero-description">
                        Guarda equipos mientras exploras el catálogo y vuelve a ellos cuando los necesites. La selección permanece en este navegador.
                    </p>
                </div>
            </section>

            <section
                className="favorites-section"
                aria-labelledby="favorites-title"
            >
                <div className="public-container">
                    <div className="favorites-heading">
                        <div>
                            <p className="eyebrow">
                                Favoritos
                            </p>

                            <h2 id="favorites-title">
                                Productos guardados
                            </h2>
                        </div>

                        <p
                            className="favorites-count"
                            aria-live="polite"
                        >
                            <strong>
                                {favoriteCount}
                            </strong>{" "}

                            {favoriteCount === 1
                                ? "producto guardado"
                                : "productos guardados"}
                        </p>
                    </div>

                    {favoriteCount === 0 ? (
                        <div className="favorites-empty">
                            <h3>
                                Todavía no guardaste productos.
                            </h3>

                            <p>
                                Explora el catálogo y utiliza el corazón de cada producto para crear tu selección de favoritos.
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
                                description={
                                    errorMessage
                                }
                                actionLabel="Intentar nuevamente"
                                onAction={
                                    reload
                                }
                            />
                        </div>
                    ) : (
                        <div className="catalog-products-grid favorites-products-grid">
                            {favoriteProducts.map(
                                (
                                    product,
                                ) => (
                                    <PublicProductCard
                                        key={
                                            product.id
                                        }
                                        product={
                                            product
                                        }
                                        categoryName={
                                            product.categoryId ===
                                            null
                                                ? "Sin categoría"
                                                : categoryNamesById.get(
                                                      product.categoryId,
                                                  ) ??
                                                  "Categoría"
                                        }
                                        opensDialog={
                                            false
                                        }
                                        onOpen={(
                                            productId,
                                        ) => {
                                            navigate(
                                                `/productos/${productId}?origen=favoritos`,
                                            );
                                        }}
                                    />
                                ),
                            )}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}