import type { BlogRow } from './blog.types.js';
export function blogSummary(row: BlogRow, admin = false) {
    return {
        id: row.id, title: row.title, slug: row.slug, excerpt: row.excerpt,
        topic: row.topic, authorName: row.author_name, coverAlt: row.cover_alt,
        coverUrl: row.cover_key ? `${admin ? '/api/admin' : '/api'}/blog/posts/${row.id}/cover?v=${row.version}` : null,
        publishedAt: row.published_at, updatedAt: row.updated_at,
        readingMinutes: Math.max(1, Math.ceil(row.content.trim().split(/\s+/).length / 200)),
        ...(admin ? { status: row.status, version: row.version, createdAt: row.created_at } : {}),
    };
}
export function blogDetail(row: BlogRow, admin = false) {
    return { ...blogSummary(row, admin), content: row.content,
        seoTitle: row.seo_title, seoDescription: row.seo_description };
}
