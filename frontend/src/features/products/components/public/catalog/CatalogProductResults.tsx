import { PublicStatePanel } from "../../../../../shared/components/feedback";
import { PublicProductCard } from "../PublicProductCard";
import type { PublicProduct } from "../../../types/product.types";

interface CatalogProductResultsProps {
    products: readonly PublicProduct[];
    categoryNamesById: ReadonlyMap<number, string>;
    hasSearch: boolean;
    onOpenProduct: (productId: number) => void;
    onReset: () => void;
}

export function CatalogProductResults({
    products,
    categoryNamesById,
    hasSearch,
    onOpenProduct,
    onReset,
}: CatalogProductResultsProps) {
    if (products.length === 0) {
        return (
            <div id="catalog-results" className="catalog-empty-filter">
                <PublicStatePanel
                    variant="not-found"
                    compact
                    eyebrow="Sin resultados"
                    title={
                        hasSearch
                            ? "No encontramos productos con esa búsqueda"
                            : "No encontramos productos con esos filtros"
                    }
                    description={
                        hasSearch
                            ? "Prueba con menos palabras, revisa el nombre del equipo o limpia la búsqueda para volver a ver el catálogo."
                            : "Prueba otra categoría o elimina algún filtro. Tu selección puede cambiar sin perder el resto de la navegación."
                    }
                    primaryAction={{
                        label: hasSearch ? "Limpiar búsqueda" : "Ver todos los productos",
                        onClick: onReset,
                    }}
                />
            </div>
        );
    }

    return (
        <div id="catalog-results">
            <div className="catalog-results-heading">
                <p>Productos disponibles</p>
                <span>Selecciona un producto para revisar su información y añadirlo a tu cotización.</span>
            </div>

            <div className="catalog-products-grid ix-content-enter">
                {products.map((product) => (
                    <PublicProductCard
                        key={product.id}
                        product={product}
                        categoryName={
                            product.categoryId === null
                                ? "Sin categoría"
                                : categoryNamesById.get(product.categoryId) ?? "Categoría"
                        }
                        onOpen={onOpenProduct}
                    />
                ))}
            </div>
        </div>
    );
}
