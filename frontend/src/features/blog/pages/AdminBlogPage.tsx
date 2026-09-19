import { useCallback, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resolveApiUrl } from "../../../shared/api/apiUrl";
import { ApiError } from "../../../shared/api/httpClient";
import { InlineAlert } from "../../../shared/components/feedback/InlineAlert";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";
import { ManagementHeader } from "../../admin/components/ManagementHeader";
import { archiveBlogPost, listAdminBlogPosts } from "../api/blog.api";
import { BlogPagination } from "../components/BlogPagination";
import { useBlogResource } from "../hooks/useBlogResource";
import { BLOG_STATUS_LABELS, blogDate } from "../model/blogEditor";
import type { AdminBlogSummary, BlogStatus } from "../model/blog.types";

export function AdminBlogPage() {
    const [params, setParams] = useSearchParams();
    const q = (params.get("q") ?? "").slice(0, 160);
    const status = (params.get("status") ?? "") as BlogStatus | "";
    const page = Math.max(1, Number(params.get("page")) || 1);
    const resource = useBlogResource(
        useCallback((signal: AbortSignal) => listAdminBlogPosts({ q, status, page }, signal), [q, status, page]),
    );
    const [pending, setPending] = useState<AdminBlogSummary | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    async function archive() {
        if (!pending || busy) return;
        setBusy(true);
        setError("");
        try {
            await archiveBlogPost(pending);
            setPending(null);
            resource.reload();
        } catch (cause) {
            setError(cause instanceof ApiError ? cause.message : "No se pudo archivar el artículo.");
        } finally {
            setBusy(false);
        }
    }

    const total = resource.data?.total ?? 0;
    const published = resource.data?.items.filter((post) => post.status === "published").length ?? 0;
    const drafts = resource.data?.items.filter((post) => post.status === "draft").length ?? 0;

    return (
        <section className="management-page blog-admin">
            <ManagementHeader
                eyebrow="Contenido"
                title="Blog"
                description="Crea artículos técnicos, añade una portada, revisa la vista previa y publica cuando el contenido esté listo."
                actions={
                    <Link className="blog-admin-primary" to="/admin/blog/new">
                        <CorporateIcon name="plus" /> Nuevo artículo
                    </Link>
                }
            />

            <div className="blog-admin-stats" aria-label="Resumen del blog">
                <div><strong>{total}</strong><span>Artículos encontrados</span></div>
                <div><strong>{published}</strong><span>Publicados en esta página</span></div>
                <div><strong>{drafts}</strong><span>Borradores en esta página</span></div>
            </div>

            <form
                className="blog-filters"
                onSubmit={(event) => {
                    event.preventDefault();
                    const data = new FormData(event.currentTarget);
                    const nextQ = String(data.get("q") ?? "").trim();
                    const nextStatus = String(data.get("status") ?? "");
                    setParams({ ...(nextQ ? { q: nextQ } : {}), ...(nextStatus ? { status: nextStatus } : {}) });
                }}
            >
                <label className="blog-admin-field blog-filter-search">
                    <span>Buscar artículo</span>
                    <div className="blog-search-control"><CorporateIcon name="search" /><input type="search" name="q" key={q} defaultValue={q} maxLength={160} placeholder="Título, tema o contenido..." /></div>
                </label>
                <label className="blog-admin-field blog-filter-status">
                    <span>Estado</span>
                    <select name="status" key={status} defaultValue={status}>
                        <option value="">Todos los estados</option>
                        {Object.entries(BLOG_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                </label>
                <button className="blog-filter-button" type="submit">Aplicar filtros</button>
                {(q || status) && (
                    <button className="blog-filter-clear" type="button" onClick={() => setParams({})}>Limpiar</button>
                )}
            </form>

            {error && <InlineAlert>{error}</InlineAlert>}

            {pending && (
                <div className="blog-archive-confirm" role="alert">
                    <div className="blog-archive-confirm-icon"><CorporateIcon name="info" /></div>
                    <div>
                        <strong>¿Archivar “{pending.title}”?</strong>
                        <p>Dejará de aparecer en el blog público. Podrás restaurarlo después desde el editor.</p>
                    </div>
                    <div className="blog-archive-confirm-actions">
                        <button type="button" disabled={busy} onClick={() => void archive()}>{busy ? "Archivando…" : "Archivar"}</button>
                        <button type="button" disabled={busy} onClick={() => setPending(null)}>Cancelar</button>
                    </div>
                </div>
            )}

            {resource.isLoading ? (
                <div className="blog-admin-empty" role="status"><span className="section-state-spinner" /> <strong>Cargando artículos…</strong></div>
            ) : resource.error ? (
                <div className="blog-admin-empty" role="alert">
                    <CorporateIcon name="info" />
                    <strong>No se pudo cargar el blog</strong>
                    <p>{resource.error.message}</p>
                    <button type="button" onClick={resource.reload}>Reintentar</button>
                </div>
            ) : !resource.data?.items.length ? (
                <div className="blog-admin-empty">
                    <CorporateIcon name="book" />
                    <strong>No hay artículos para mostrar</strong>
                    <p>Crea un artículo nuevo o cambia los filtros actuales.</p>
                    <Link className="blog-admin-primary" to="/admin/blog/new">Crear primer artículo</Link>
                </div>
            ) : (
                <div className="blog-admin-grid">
                    {resource.data.items.map((post) => (
                        <article className="blog-admin-card" key={post.id}>
                            <Link className="blog-admin-card-cover" to={`/admin/blog/${post.id}/edit`}>
                                {post.coverUrl ? (
                                    <img src={resolveApiUrl(post.coverUrl) ?? undefined} alt="" loading="lazy" />
                                ) : (
                                    <span className="blog-admin-card-placeholder"><CorporateIcon name="book" /> Sin portada</span>
                                )}
                                <span className={`blog-status blog-status-${post.status}`}>{BLOG_STATUS_LABELS[post.status]}</span>
                            </Link>
                            <div className="blog-admin-card-body">
                                <div className="blog-admin-card-meta"><span>{post.topic}</span><span>{post.readingMinutes} min</span></div>
                                <Link className="blog-admin-card-title" to={`/admin/blog/${post.id}/edit`}>{post.title}</Link>
                                <p>{post.excerpt || "Este artículo todavía no tiene resumen."}</p>
                                <div className="blog-admin-card-updated"><CorporateIcon name="clock" /> Actualizado {blogDate(post.updatedAt)}</div>
                            </div>
                            <div className="blog-admin-card-actions">
                                <Link to={`/admin/blog/${post.id}/edit`}>Editar artículo <CorporateIcon name="arrow" /></Link>
                                {post.status !== "archived" && (
                                    <button type="button" onClick={() => setPending(post)}>Archivar</button>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}

            <BlogPagination
                page={page}
                totalPages={resource.data?.totalPages ?? 0}
                onChange={(value) => setParams({ ...(q ? { q } : {}), ...(status ? { status } : {}), page: String(value) })}
            />
        </section>
    );
}
