export type BlogStatus = 'draft' | 'published' | 'archived';

export interface BlogSummary {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    topic: string;
    authorName: string;
    coverUrl: string | null;
    coverAlt: string;
    publishedAt: string | null;
    updatedAt: string;
    readingMinutes: number;
}

export interface BlogPost extends BlogSummary {
    content: string;
    seoTitle: string;
    seoDescription: string;
}

export interface AdminBlogPost extends BlogPost {
    status: BlogStatus;
    version: number;
    createdAt: string;
}

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

export interface BlogPage<T = BlogSummary> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export type AdminBlogSummary = BlogSummary & Pick<AdminBlogPost, 'status' | 'version' | 'createdAt'>;
export interface BlogFilters { q?: string; topic?: string; page?: number; pageSize?: number; status?: BlogStatus | ''; }
