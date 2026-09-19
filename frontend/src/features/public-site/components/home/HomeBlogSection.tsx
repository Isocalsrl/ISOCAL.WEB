import { Link } from "react-router-dom";
import { BlogCard } from "../../../blog/components/BlogCard";
import { useBlogPosts } from "../../../blog/hooks/useBlogPosts";
import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";

export function HomeBlogSection() {
    const posts = useBlogPosts({ page: 1, pageSize: 3 });

    if (!posts.isLoading && (posts.error || !posts.data?.items.length)) return null;

    return (
        <section className="ix-section ix-home-blog" aria-labelledby="home-blog-title">
            <div className="public-container">
                <header className="ix-section-intro ix-section-intro-split">
                    <div>
                        <p className="ix-kicker">Blog técnico</p>
                        <h2 id="home-blog-title">Criterios, casos y novedades técnicas.</h2>
                    </div>
                    <div className="ix-section-action-copy">
                        <p>
                            Artículos sobre medición, laboratorio, instrumentos y gestión metrológica.
                        </p>
                        <Link className="ix-inline-link" to="/blog">
                            Ver todos los artículos <CorporateIcon name="arrow" />
                        </Link>
                    </div>
                </header>

                {posts.isLoading ? (
                    <div className="ix-home-blog-grid" aria-busy="true" aria-label="Cargando artículos">
                        {[0, 1, 2].map((item) => (
                            <div className="ix-home-blog-skeleton" key={item} aria-hidden="true">
                                <span />
                                <i />
                                <i />
                                <i />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="blog-grid ix-home-blog-grid">
                        {posts.data?.items.slice(0, 3).map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
