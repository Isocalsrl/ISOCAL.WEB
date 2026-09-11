import {
    PublicProductCard,
} from "../PublicProductCard";

import type {
    PublicProduct,
} from "../../../types/product.types";

interface CatalogProductResultsProps {
    products:
        readonly PublicProduct[];

    categoryNamesById:
        ReadonlyMap<
            number,
            string
        >;

    hasSearch:
        boolean;

    onOpenProduct:
        (
            productId:
                number,
        ) => void;

    onReset:
        () => void;
}

export function CatalogProductResults({
    products,
    categoryNamesById,
    hasSearch,
    onOpenProduct,
    onReset,
}: CatalogProductResultsProps) {
    return (
        <div id="catalog-results">
            {
                products.length ===
                0
                    ? (
                        <div className="catalog-empty-filter">
                            <h3>
                                {
                                    hasSearch
                                        ? "No encontramos coincidencias"
                                        : "No hay productos en esta categoría"
                                }
                            </h3>

                            <p>
                                {
                                    hasSearch
                                        ? "Prueba con un nombre más corto o limpia la búsqueda para volver a ver el catálogo."
                                        : "Actualmente no existen productos públicos disponibles dentro de esta categoría."
                                }
                            </p>

                            <button
                                className="ui-button ui-button-secondary"
                                type="button"
                                onClick={
                                    onReset
                                }
                            >
                                {
                                    hasSearch
                                        ? "Limpiar búsqueda"
                                        : "Ver todos los productos"
                                }
                            </button>
                        </div>
                    )
                    : (
                        <div className="catalog-products-grid">
                            {
                                products.map(
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
                                            onOpen={
                                                onOpenProduct
                                            }
                                        />
                                    ),
                                )
                            }
                        </div>
                    )
            }
        </div>
    );
}
