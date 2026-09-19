import { useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PublicStatePanel } from "../../../shared/components/feedback";
import { PageSeo } from "../../../shared/seo/PageSeo";
import { listBlogTopics } from "../api/blog.api";
import { BlogCard } from "../components/BlogCard";
import { BlogPagination } from "../components/BlogPagination";
import { useBlogResource } from "../hooks/useBlogResource";
import { useBlogPosts } from "../hooks/useBlogPosts";

function BlogGridSkeleton() {
    return (
        <div className="blog-grid" role="status" aria-live="polite" aria-busy="true">
            <span className="sr-only">Cargando artículos.</span>
            {Array.from({ length: 6 }, (_, item) => (
                <div className="ix-home-blog-skeleton" key={item} aria-hidden="true">
                    <span />
                    <i />
                    <i />
                    <i />
                </div>
            ))}
        </div>
    );
}

export function BlogPage() {
    const [params, setParams] = useSearchParams();
    const page = Math.min(100000, Math.max(1, Number(params.get("page")) || 1));
    const q = (params.get("q") ?? "").slice(0, 160);
    const topic = (params.get("topic") ?? "").slice(0, 80);
    const posts = useBlogPosts({ q, topic, page });
    const topics = useBlogResource(useCallback((signal: AbortSignal) => listBlogTopics(signal), []));
    const hasActiveFilters = Boolean(q || topic || page > 1);
    const showFilters = hasActiveFilters || (posts.data?.total ?? 0) > 0;

    function update(values: Record<string, string>) {
        const next = new URLSearchParams(params);
        Object.entries(values).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key));
        setParams(next);
    }

    return (
        <main className="blog-page">
            <PageSeo
                title="Blog de metrología e industria | ISOCAL"
                description="Artículos y novedades sobre medición, instrumentos y servicios para la industria."
                canonicalPath="/blog"
            />
            <section className="blog-hero">
                <div className="public-container">
                    <p className="ix-breadcrumb"><Link to="/">Inicio</Link> / Blog</p>
                    <p className="ix-kicker ix-kicker-light">Blog ISOCAL</p>
                    <h1>Notas técnicas para laboratorio e industria.</h1>
                    <p>Artículos sobre medición, instrumentos, servicios y gestión metrológica.</p>
                </div>
            </section>

            <section className="ix-section">
                <div className="public-container">
                    {showFilters ? (
                        <form
                            className="blog-filters"
                            onSubmit={(event) => {
                                event.preventDefault();
                                const data = new FormData(event.currentTarget);
                                update({ q: String(data.get("q") ?? "").trim(), page: "" });
                            }}
                        >
                            <label>
                                Buscar artículos
                                <input key={q} name="q" defaultValue={q} maxLength={160} placeholder="Equipo, magnitud o tema" type="search" />
                            </label>
                            <button className="ix-button ix-button-primary" type="submit">Buscar</button>
                            <label>
                                Tema
                                <select value={topic} onChange={(event) => update({ topic: event.target.value, page: "" })}>
                                    <option value="">Todos los temas</option>
                                    {[...new Set([...(topics.data ?? []), ...(topic ? [topic] : [])])].map((item) => <option key={item}>{item}</option>)}
                                </select>
                            </label>
                        </form>
                    ) : null}

                    {posts.isLoading ? (
                        <BlogGridSkeleton />
                    ) : posts.error ? (
                        <PublicStatePanel
                            variant={posts.error.status === 0 ? "network" : "error"}
                            eyebrow={posts.error.status === 0 ? "Sin conexión" : "Blog no disponible"}
                            title={posts.error.status === 0 ? "No pudimos conectar con el blog" : "No pudimos cargar los artículos"}
                            description={posts.error.message}
                            primaryAction={{ label: "Volver a intentar", onClick: posts.reload }}
                            secondaryAction={{ label: "Ver servicios", to: "/servicios" }}
                        />
                    ) : posts.data?.items.length ? (
                        <>
                            <div className="blog-grid">
                                {posts.data.items.map((post) => <BlogCard key={post.id} post={post} />)}
                            </div>
                            <BlogPagination page={page} totalPages={posts.data?.totalPages ?? 0} onChange={(value) => update({ page: String(value) })} />
                        </>
                    ) : (
                        <PublicStatePanel
                            variant="empty"
                            eyebrow={hasActiveFilters ? "Sin coincidencias" : "Contenido en preparación"}
                            title={hasActiveFilters ? "No encontramos artículos con esos filtros" : "Aún no hay artículos publicados"}
                            description={
                                q || topic
                                    ? "Prueba otro término, cambia el tema o limpia los filtros para volver a ver todo el contenido."
                                    : "Mientras publicamos nuevas notas técnicas, puedes revisar nuestros servicios y herramientas."
                            }
                            primaryAction={
                                hasActiveFilters
                                    ? { label: "Limpiar filtros", onClick: () => setParams({}) }
                                    : { label: "Ver herramientas", to: "/herramientas" }
                            }
                            secondaryAction={{ label: "Explorar servicios", to: "/servicios" }}
                        />
                    )}
                </div>
            </section>
        </main>
    );
}
