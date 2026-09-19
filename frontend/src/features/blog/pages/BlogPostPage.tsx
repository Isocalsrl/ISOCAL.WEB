import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { PublicStatePanel } from "../../../shared/components/feedback";
import { resolveApiUrl } from "../../../shared/api/apiUrl";
import { PageSeo } from "../../../shared/seo/PageSeo";
import { absoluteUrl } from "../../../shared/seo/seoDom";
import { getBlogPost } from "../api/blog.api";
import { BlogContent } from "../components/BlogContent";
import { useBlogResource } from "../hooks/useBlogResource";
import { blogDate } from "../model/blogEditor";

function BlogArticleSkeleton() {
    return (
        <main className="blog-post-page">
            <div className="public-container blog-article blog-article-skeleton" role="status" aria-live="polite" aria-busy="true">
                <span className="sr-only">Cargando artículo.</span>
                <header aria-hidden="true">
                    <span className="ix-skeleton ix-skeleton-line" style={{ width: "18%" }} />
                    <span className="ix-skeleton ix-skeleton-line" style={{ width: "26%" }} />
                    <span className="ix-skeleton ix-skeleton-line blog-article-skeleton-title" />
                    <span className="ix-skeleton ix-skeleton-line" style={{ width: "78%" }} />
                    <span className="ix-skeleton ix-skeleton-line" style={{ width: "42%" }} />
                </header>
                <span className="ix-skeleton blog-article-skeleton-cover" aria-hidden="true" />
                <div className="blog-article-skeleton-copy" aria-hidden="true">
                    {Array.from({ length: 8 }, (_, index) => (
                        <span className="ix-skeleton ix-skeleton-line" style={{ width: `${92 - (index % 3) * 11}%` }} key={index} />
                    ))}
                </div>
            </div>
        </main>
    );
}

export function BlogPostPage() {
    const { slug = "" } = useParams();
    const resource = useBlogResource(useCallback((signal: AbortSignal) => getBlogPost(slug, signal), [slug]));
    const post = resource.data;

    if (resource.isLoading) {
        return <BlogArticleSkeleton />;
    }

    if (!post) {
        const notFound = resource.error?.status === 404;
        return (
            <main className="ix-section blog-post-state-page">
                <div className="public-container">
                    <PageSeo title="Artículo | ISOCAL" description="Blog técnico de ISOCAL." canonicalPath={`/blog/${slug}`} />
                    <PublicStatePanel
                        variant={notFound ? "not-found" : resource.error?.status === 0 ? "network" : "error"}
                        eyebrow={notFound ? "Artículo no encontrado" : "Blog no disponible"}
                        title={notFound ? "Este artículo ya no está disponible" : "No pudimos cargar el artículo"}
                        description={
                            notFound
                                ? "Puede haberse movido, actualizado o retirado. Revisa el blog para encontrar contenido relacionado."
                                : resource.error?.message ?? "Ocurrió un problema al recuperar el contenido."
                        }
                        primaryAction={notFound ? { label: "Volver al blog", to: "/blog" } : { label: "Volver a intentar", onClick: resource.reload }}
                        secondaryAction={{ label: "Explorar servicios", to: "/servicios" }}
                    />
                </div>
            </main>
        );
    }

    return (
        <main className="blog-post-page">
            <PageSeo
                title={`${post.seoTitle || post.title} | ISOCAL`}
                description={post.seoDescription || post.excerpt}
                canonicalPath={`/blog/${post.slug}`}
                image={post.coverUrl ?? undefined}
                structuredData={{
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    headline: post.title,
                    description: post.excerpt,
                    datePublished: post.publishedAt,
                    dateModified: post.updatedAt,
                    author: { "@type": "Organization", name: post.authorName },
                    publisher: { "@type": "Organization", name: "ISOCAL" },
                    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
                    ...(post.coverUrl ? { image: absoluteUrl(post.coverUrl) } : {}),
                }}
            />
            <article className="public-container blog-article">
                <header>
                    <Link to="/blog" className="ix-inline-link">← Volver al blog</Link>
                    <p className="blog-topic">{post.topic}</p>
                    <h1>{post.title}</h1>
                    <p className="blog-article-excerpt">{post.excerpt}</p>
                    <p className="blog-meta">{post.authorName} · {blogDate(post.publishedAt)} · {post.readingMinutes} min de lectura</p>
                </header>
                {post.coverUrl ? <img className="blog-article-cover" src={resolveApiUrl(post.coverUrl) ?? undefined} alt={post.coverAlt} /> : null}
                <BlogContent content={post.content} />
                <footer className="blog-article-footer">
                    <p>¿Tienes una consulta sobre tu equipo o laboratorio?</p>
                    <Link to="/contacto" className="ix-button ix-button-primary">Contactar a ISOCAL</Link>
                </footer>
            </article>
        </main>
    );
}
