import { Link } from "react-router-dom";
import { resolveApiUrl } from "../../../shared/api/apiUrl";
import { ProgressiveImage } from "../../../shared/components/media/ProgressiveImage";
import { blogDate } from "../model/blogEditor";
import type { BlogSummary } from '../model/blog.types';

export function BlogCard({post}: { post: BlogSummary }) {
    return <article className="blog-card">
        <Link to={`/blog/${post.slug}`} className="blog-card-link">
            {post.coverUrl ? <ProgressiveImage src={resolveApiUrl(post.coverUrl) ?? undefined} alt={post.coverAlt} loading="lazy" /> : <div className="blog-card-placeholder" aria-hidden="true">ISOCAL</div>}
            <div className="blog-card-copy">
                <span className="blog-topic">{post.topic}</span>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
                <span className="blog-meta">{blogDate(post.publishedAt)} · {post.readingMinutes} min de lectura</span>
            </div>
        </Link>
    </article>;
}

