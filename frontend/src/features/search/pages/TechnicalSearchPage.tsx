import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PublicStatePanel } from "../../../shared/components/feedback";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";
import { PageSeo } from "../../../shared/seo/PageSeo";
import { UniversalSearchBar } from "../components/UniversalSearchBar";
import { useTechnicalSearch } from "../hooks/useTechnicalSearch";

const KIND_LABELS = {
    product: "Producto",
    category: "Categoría",
    service: "Servicio",
    tool: "Herramienta",
    article: "Artículo",
} as const;

function TechnicalSearchSkeleton() {
    return (
        <div className="technical-results-skeleton" role="status" aria-live="polite" aria-busy="true">
            <span className="sr-only">Buscando en el portafolio técnico.</span>
            <div className="technical-results-skeleton-heading" aria-hidden="true">
                <span className="ix-skeleton ix-skeleton-line" />
                <span className="ix-skeleton ix-skeleton-line" />
            </div>
            <div className="technical-results-grid" aria-hidden="true">
                {Array.from({ length: 6 }, (_, index) => (
                    <div className="technical-result-card technical-result-card-skeleton" key={index}>
                        <span className="ix-skeleton ix-skeleton-line" />
                        <span className="ix-skeleton ix-skeleton-line" />
                        <span className="ix-skeleton ix-skeleton-line" />
                        <span className="ix-skeleton ix-skeleton-line" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export function TechnicalSearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q")?.trim() ?? "";
    const { catalog, blog, results, isLoading } = useTechnicalSearch(query);
    const [kindFilter, setKindFilter] = useState<"all" | keyof typeof KIND_LABELS>("all");
    const filteredResults = useMemo(
        () => (kindFilter === "all" ? results : results.filter((result) => result.kind === kindFilter)),
        [kindFilter, results],
    );

    return (
        <main className="technical-search-page">
            <PageSeo
                title={query ? `Buscar “${query}” | ISOCAL` : "Buscador técnico | ISOCAL"}
                description="Busca productos, categorías, magnitudes, equipos y servicios técnicos de ISOCAL desde un solo lugar."
                canonicalPath="/buscar"
            />

            <section className="technical-page-hero technical-search-hero">
                <div className="public-container technical-page-hero-inner">
                    <p className="ix-kicker ix-kicker-light">Buscador técnico</p>
                    <h1>Busca equipos, servicios y capacidades.</h1>
                    <p>
                        Escribe un equipo, magnitud, unidad o servicio. Buscaremos coincidencias en el contenido publicado de ISOCAL.
                    </p>
                    <UniversalSearchBar initialValue={query} autoFocus={!query} />
                    <div className="technical-search-examples" aria-label="Ejemplos de búsqueda">
                        <span>Ejemplos:</span>
                        {["manómetro", "balanza", "temperatura", "PSI", "multímetro"].map((example) => (
                            <Link key={example} to={`/buscar?q=${encodeURIComponent(example)}`}>
                                {example}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="ix-section technical-results-section">
                <div className="public-container">
                    {blog.error ? (
                        <div className="technical-catalog-warning" role="status">
                            <span>No pudimos consultar los artículos del blog.</span>
                            <button type="button" onClick={blog.reload}>Reintentar blog</button>
                        </div>
                    ) : null}

                    {catalog.errorMessage ? (
                        <div className="technical-catalog-warning" role="status">
                            <span>No pudimos consultar el catálogo.</span>
                            <button type="button" onClick={catalog.reload}>Reintentar catálogo</button>
                        </div>
                    ) : null}

                    {isLoading ? (
                        <TechnicalSearchSkeleton />
                    ) : query.length < 2 ? (
                        <PublicStatePanel
                            variant="info"
                            compact
                            eyebrow="Empieza por una referencia"
                            title="Escribe al menos dos caracteres"
                            description="Puedes buscar por nombre de equipo, magnitud, categoría o unidad técnica. Por ejemplo: manómetro, temperatura o PSI."
                        />
                    ) : results.length === 0 ? (
                        <PublicStatePanel
                            variant="not-found"
                            eyebrow="Sin coincidencias directas"
                            title={`No encontramos resultados para “${query}”`}
                            description="Prueba con un término más general, revisa la escritura o usa el orientador técnico para encontrar el servicio adecuado según tu necesidad."
                            primaryAction={{ label: "Usar orientador técnico", to: "/herramientas#orientador" }}
                            secondaryAction={{ label: "Explorar productos", to: "/productos" }}
                        />
                    ) : (
                        <>
                            <header className="technical-results-heading">
                                <div>
                                    <p className="ix-kicker">Resultados relacionados</p>
                                    <h2>{filteredResults.length} coincidencia{filteredResults.length === 1 ? "" : "s"} para “{query}”</h2>
                                </div>
                                <Link className="ix-inline-link" to="/herramientas">
                                    Ver herramientas <CorporateIcon name="arrow" />
                                </Link>
                            </header>

                            <div className="technical-result-filters" aria-label="Filtrar resultados">
                                <button
                                    className={kindFilter === "all" ? "is-active" : ""}
                                    type="button"
                                    aria-pressed={kindFilter === "all"}
                                    onClick={() => setKindFilter("all")}
                                >
                                    Todo <span>{results.length}</span>
                                </button>
                                {(Object.keys(KIND_LABELS) as Array<keyof typeof KIND_LABELS>).map((kind) => {
                                    const count = results.filter((result) => result.kind === kind).length;
                                    return count > 0 ? (
                                        <button
                                            key={kind}
                                            className={kindFilter === kind ? "is-active" : ""}
                                            type="button"
                                            aria-pressed={kindFilter === kind}
                                            onClick={() => setKindFilter(kind)}
                                        >
                                            {KIND_LABELS[kind]} <span>{count}</span>
                                        </button>
                                    ) : null;
                                })}
                            </div>

                            {filteredResults.length === 0 ? (
                                <div className="technical-filter-empty">
                                    <PublicStatePanel
                                        variant="empty"
                                        compact
                                        eyebrow="Filtro sin resultados"
                                        title="No hay resultados de este tipo"
                                        description="La búsqueda sí tiene coincidencias en otras categorías. Quita este filtro para ver todos los resultados disponibles."
                                        primaryAction={{ label: "Ver todos los resultados", onClick: () => setKindFilter("all") }}
                                    />
                                </div>
                            ) : (
                                <div className="technical-results-grid ix-content-enter">
                                    {filteredResults.map((result) => (
                                        <Link className="technical-result-card" to={result.href} key={result.id}>
                                            <div className="technical-result-meta">
                                                <span>{KIND_LABELS[result.kind]}</span>
                                                <small>{result.eyebrow}</small>
                                            </div>
                                            <h3>{result.title}</h3>
                                            <p>{result.description}</p>
                                            <span className="technical-result-link">
                                                Abrir <CorporateIcon name="arrow" />
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {(blog.data?.total ?? 0) > 6 ? (
                                <Link className="ix-inline-link" to={`/blog?q=${encodeURIComponent(query)}`}>
                                    Ver todos los artículos relacionados
                                </Link>
                            ) : null}
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}
