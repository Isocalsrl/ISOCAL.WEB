export type BlogStatus = 'draft' | 'published' | 'archived';
export interface BlogInput {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    topic: string;
    authorName: string;
    status: BlogStatus;
    seoTitle: string;
    seoDescription: string;
    coverAlt: string;
}
export interface BlogRow {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    topic: string;
    author_name: string;
    status: BlogStatus;
    seo_title: string;
    seo_description: string;
    cover_key: string | null;
    cover_mime: string | null;
    cover_hash: string | null;
    cover_alt: string;
    version: number;
    created_at: Date;
    updated_at: Date;
    published_at: Date | null;
}
export interface BlogQuery {
    page: number;
    pageSize: number;
    query: string;
    topic: string;
    status?: BlogStatus;
}
export interface BlogCover {
    key: string;
    mime: string;
    hash: string;
    alt: string;
}
