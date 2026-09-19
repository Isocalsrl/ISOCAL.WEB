import { Link, useNavigate } from "react-router-dom";
import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";
import { ProductCardSkeleton, PublicStatePanel } from "../../../../shared/components/feedback";
import { PublicProductCard } from "../../../products/components/public/PublicProductCard";
import { usePublicCatalog } from "../../../products/hooks/usePublicCatalog";
import { brands } from "../../data/corporate";
import { Carousel } from "../Corporate";

export function HomeCatalogSection() {
    const catalog = usePublicCatalog();
    const navigate = useNavigate();
    const homeCategories = catalog.categories.slice(0, 6).map((category, index) => ({
        ...category,
        index,
        count: catalog.products.filter((product) => product.categoryId === category.id).length,
    }));

    return (
        <section className="ix-section ix-home-catalog">
            <div className="public-container">
                <header className="ix-section-intro ix-section-intro-split">
                    <div>
                        <p className="ix-kicker">Catálogo técnico</p>
                        <h2>Equipos e insumos para tu operación.</h2>
                    </div>
                    <div className="ix-section-action-copy">
                        <p>Instrumentación, herramientas y equipamiento organizados por categoría para consulta y cotización.</p>
                        <Link className="ix-inline-link" to="/productos">
                            Ver catálogo <CorporateIcon name="arrow" />
                        </Link>
                    </div>
                </header>

                {homeCategories.length > 0 && (
                    <div className="ix-home-category-grid" aria-label="Categorías del catálogo">
                        {homeCategories.map((category) => (
                            <Link
                                className={`ix-home-category-card ix-home-category-card-${category.index + 1}`}
                                key={category.id}
                                to={`/productos?categoria=${category.slug}`}
                            >
                                <div className="ix-home-category-orb" aria-hidden="true">
                                    {String(category.index + 1).padStart(2, "0")}
                                </div>
                                <div>
                                    <small>Categoría técnica</small>
                                    <strong>{category.name}</strong>
                                    <span>{category.count} producto{category.count === 1 ? "" : "s"}</span>
                                </div>
                                <CorporateIcon name="arrow" />
                            </Link>
                        ))}
                    </div>
                )}

                {catalog.isLoading ? (
                    <div className="ix-home-catalog-loading" role="status" aria-live="polite" aria-busy="true">
                        <span className="sr-only">Cargando equipos destacados.</span>
                        {Array.from({ length: 3 }, (_, index) => <ProductCardSkeleton key={index} />)}
                    </div>
                ) : catalog.errorMessage ? (
                    <PublicStatePanel
                        compact
                        variant={catalog.errorKind === "network" ? "network" : "error"}
                        eyebrow={catalog.errorKind === "network" ? "Sin conexión" : "Catálogo no disponible"}
                        title="No pudimos cargar los equipos destacados"
                        description={catalog.errorMessage}
                        primaryAction={{ label: "Volver a intentar", onClick: catalog.reload }}
                        secondaryAction={{ label: "Ir al catálogo", to: "/productos" }}
                    />
                ) : (
                    <Carousel label="Equipos del portafolio">
                        {catalog.products.slice(0, 6).map((product) => (
                            <PublicProductCard
                                key={product.id}
                                product={product}
                                categoryName={
                                    catalog.categories.find((category) => category.id === product.categoryId)
                                        ?.name || "Equipos"
                                }
                                onOpen={(id) => navigate(`/productos/${id}`)}
                                opensDialog={false}
                            />
                        ))}
                    </Carousel>
                )}

                <div className="ix-brand-line" aria-label="Marcas del portafolio">
                    <span>Marcas del portafolio</span>
                    <div className="ix-brand-marquee">
                        <div className="ix-brand-marquee-track">
                            <div className="ix-brand-marquee-group">
                                {brands.map((brand) => (
                                    <strong key={brand}>{brand}</strong>
                                ))}
                            </div>
                            <div className="ix-brand-marquee-group" aria-hidden="true">
                                {brands.map((brand) => (
                                    <strong key={`duplicate-${brand}`}>{brand}</strong>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
