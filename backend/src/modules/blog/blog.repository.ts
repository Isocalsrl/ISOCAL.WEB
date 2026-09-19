import { db } from '../../database/db.js';
import type { BlogCover, BlogInput, BlogQuery, BlogRow } from './blog.types.js';

const predicate = `($1 IS NULL OR status = $1)
    AND ($2 = '' OR LOWER(CONCAT_WS(' ', title, excerpt, topic, content)) LIKE CONCAT('%', LOWER($2), '%'))
    AND ($3 = '' OR topic = $3)`;

export async function listPosts(query: BlogQuery): Promise<{ total: number; items: BlogRow[] }> {
    const values = [query.status ?? null, query.query, query.topic];
    const order = query.status === 'published' ? 'published_at DESC, id DESC' : 'updated_at DESC, id DESC';

    const count = await db.query<{ total: string | number }>(`
        SELECT COUNT(*) AS total
        FROM blog_posts
        WHERE ${predicate}
    `, values);

    const page = await db.query<BlogRow>(`
        SELECT *
        FROM blog_posts
        WHERE ${predicate}
        ORDER BY ${order}
        LIMIT $4 OFFSET $5
    `, [...values, query.pageSize, (query.page - 1) * query.pageSize]);

    return { total: Number(count.rows[0]?.total ?? 0), items: page.rows };
}

export async function listTopics(): Promise<string[]> {
    const result = await db.query<{ topic: string }>(
        "SELECT DISTINCT topic FROM blog_posts WHERE status = 'published' ORDER BY topic",
    );
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
    return [
        input.title,
        input.slug,
        input.excerpt,
        input.content,
        input.topic,
        input.authorName,
        input.status,
        input.seoTitle,
        input.seoDescription,
        input.coverAlt,
    ];
}

export async function createPost(input: BlogInput, adminId: number): Promise<BlogRow> {
    const result = await db.query(`
        INSERT INTO blog_posts (
            title, slug, excerpt, content, topic, author_name, status,
            seo_title, seo_description, cover_alt, created_by, updated_by, published_at
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$11,CASE WHEN $7 = 'published' THEN CURRENT_TIMESTAMP ELSE NULL END)
    `, [...inputValues(input), adminId]);
    const created = await findById(result.insertId);
    if (!created) throw new Error('No se pudo recuperar el artículo creado.');
    return created;
}

export async function updatePost(id: number, version: number, input: BlogInput, adminId: number): Promise<BlogRow | null> {
    const result = await db.query(`
        UPDATE blog_posts
        SET title=$1, slug=$2, excerpt=$3, content=$4, topic=$5, author_name=$6,
            status=$7, seo_title=$8, seo_description=$9, cover_alt=$10, updated_by=$11,
            published_at=CASE WHEN $7='published' THEN COALESCE(published_at, CURRENT_TIMESTAMP) ELSE published_at END,
            updated_at=CURRENT_TIMESTAMP, version=version+1
        WHERE id=$12 AND version=$13
    `, [...inputValues(input), adminId, id, version]);
    if (result.rowCount === 0) return null;
    return findById(id);
}

export async function archivePost(id: number, version: number, adminId: number): Promise<BlogRow | null> {
    const result = await db.query(`
        UPDATE blog_posts
        SET status='archived', version=version+1, updated_at=CURRENT_TIMESTAMP, updated_by=$3
        WHERE id=$1 AND version=$2
    `, [id, version, adminId]);
    if (result.rowCount === 0) return null;
    return findById(id);
}

export async function setCover(id: number, version: number, cover: BlogCover | null, adminId: number): Promise<BlogRow | null> {
    const result = await db.query(`
        UPDATE blog_posts
        SET cover_key=$3, cover_mime=$4, cover_hash=$5, cover_alt=$6,
            version=version+1, updated_at=CURRENT_TIMESTAMP, updated_by=$7
        WHERE id=$1 AND version=$2
    `, [id, version, cover?.key ?? null, cover?.mime ?? null, cover?.hash ?? null, cover?.alt ?? '', adminId]);
    if (result.rowCount === 0) return null;
    return findById(id);
}
