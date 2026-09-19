import { Link } from "react-router-dom";

interface CatalogHeroSectionProps {
    productCount: number;
    categoryCount: number;
    isLoading?: boolean;
}

export function CatalogHeroSection({
    productCount,
    categoryCount,
    isLoading = false,
}: CatalogHeroSectionProps) {
    return (
        <section className="catalog-hero" aria-labelledby="catalog-hero-title">
            <div className="public-container catalog-hero-inner">
                <div className="catalog-hero-copy">
                    <p className="ix-breadcrumb">
                        <Link to="/">Inicio</Link> <span>/</span> Productos
                    </p>
                    <h1 id="catalog-hero-title">Catálogo de equipos e insumos.</h1>
                    <p>Instrumentos y herramientas para laboratorio e industria, organizados por categoría.</p>

                    <div className="catalog-hero-summary" aria-label="Datos del catálogo" aria-busy={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="catalog-hero-summary-skeleton" aria-hidden="true" />
                                <span className="catalog-hero-summary-skeleton" aria-hidden="true" />
                                <span>Venta y alquiler de equipos</span>
                                <span className="sr-only">Cargando datos del catálogo.</span>
                            </>
                        ) : (
                            <>
                                <span>{productCount} productos</span>
                                <span>{categoryCount} categorías</span>
                                <span>Venta y alquiler de equipos</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="catalog-hero-media" aria-hidden="true">
                    <img src="/images/products/catalogo-editorial.webp" alt="" fetchPriority="high" />
                </div>
            </div>
        </section>
    );
}
