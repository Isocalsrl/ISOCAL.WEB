import { db } from '../../database/db.js';
import type { BlogCover, BlogInput, BlogQuery, BlogRow } from './blog.types.js';
const searchDocument = "to_tsvector('spanish', title || ' ' || excerpt || ' ' || topic || ' ' || content)";
const predicate = `($1::text IS NULL OR status = $1)
    AND ($2 = '' OR ${searchDocument} @@ plainto_tsquery('spanish', $2)
        OR strpos(lower(title || ' ' || topic), lower($2)) > 0)
    AND ($3 = '' OR topic = $3)`;
export async function listPosts(query: BlogQuery) {
    const values = [query.status ?? null, query.query, query.topic];
    const order = query.status === 'published' ? 'published_at DESC, id DESC' : 'updated_at DESC, id DESC';
    const result = await db.query<{
        total: number;
        items: BlogRow[];
    }>(`
        WITH matching AS (SELECT * FROM blog_posts WHERE ${predicate}),
        page AS (SELECT * FROM matching ORDER BY ${order} LIMIT $4 OFFSET $5)
        SELECT (SELECT count(*)::int FROM matching) AS total,
            COALESCE((SELECT json_agg(page) FROM page), '[]'::json) AS items
    `, [...values, query.pageSize, (query.page - 1) * query.pageSize]);
    return result.rows[0];
}
export async function listTopics(): Promise<string[]> {
    const result = await db.query<{
        topic: string;
    }>("SELECT DISTINCT topic FROM blog_posts WHERE status = 'published' ORDER BY topic");
    return result.rows.map(row => row.topic);
}
export async function findById(id: number): Promise<BlogRow | null> {
    const result = await db.query<BlogRow>('SELECT * FROM blog_posts WHERE id = $1', [id]);
    return result.rows[0] ?? null;
}
export async function findPublishedBySlug(slug: string): Promise<BlogRow | null> {
    const result = await db.query<BlogRow>("SELECT * FROM blog_posts WHERE slug = $1 AND status = 'published'", [slug]);
    return result.rows[0] ?? null;
}
function inputValues(input: BlogInput) {
    return [input.title, input.slug, input.excerpt, input.content, input.topic, input.authorName,
        input.status, input.seoTitle, input.seoDescription, input.coverAlt];
}
export async function createPost(input: BlogInput, adminId: number): Promise<BlogRow> {
    const result = await db.query<BlogRow>(`
        INSERT INTO blog_posts (title, slug, excerpt, content, topic, author_name, status,
            seo_title, seo_description, cover_alt, created_by, updated_by, published_at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$11,CASE WHEN $7 = 'published' THEN now() END)
        RETURNING *
    `, [...inputValues(input), adminId]);
    return result.rows[0];
}
export async function updatePost(id: number, version: number, input: BlogInput, adminId: number): Promise<BlogRow | null> {
    const result = await db.query<BlogRow>(`
        UPDATE blog_posts SET title=$1, slug=$2, excerpt=$3, content=$4, topic=$5, author_name=$6,
            status=$7, seo_title=$8, seo_description=$9, cover_alt=$10, updated_by=$11,
            published_at=CASE WHEN $7='published' THEN COALESCE(published_at, now()) ELSE published_at END,
            updated_at=now(), version=version+1
        WHERE id=$12 AND version=$13 RETURNING *
    `, [...inputValues(input), adminId, id, version]);
    return result.rows[0] ?? null;
}
export async function archivePost(id: number, version: number, adminId: number): Promise<BlogRow | null> {
    const result = await db.query<BlogRow>(`
        UPDATE blog_posts SET status='archived', version=version+1, updated_at=now(), updated_by=$3
        WHERE id=$1 AND version=$2 RETURNING *
    `, [id, version, adminId]);
    return result.rows[0] ?? null;
}
export async function setCover(id: number, version: number, cover: BlogCover | null, adminId: number): Promise<BlogRow | null> {
    const result = await db.query<BlogRow>(`
        UPDATE blog_posts SET cover_key=$3, cover_mime=$4, cover_hash=$5, cover_alt=$6,
            version=version+1, updated_at=now(), updated_by=$7
        WHERE id=$1 AND version=$2 RETURNING *
    `, [id, version, cover?.key ?? null, cover?.mime ?? null, cover?.hash ?? null, cover?.alt ?? '', adminId]);
    return result.rows[0] ?? null;
}
