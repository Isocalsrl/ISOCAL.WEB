import { request } from "../../../shared/api/httpClient";
import type { AdminBlogPost, AdminBlogSummary, BlogFilters, BlogInput, BlogPage, BlogPost } from '../model/blog.types';

function queryString(filters: BlogFilters) {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => { if (value !== undefined && value !== '') query.set(key, String(value)); });
    return query.toString();
}

export const listBlogPosts = (filters: BlogFilters, signal?: AbortSignal) => request<BlogPage>(`/api/blog/posts?${queryString(filters)}`, {signal});
export const listBlogTopics = (signal?: AbortSignal) => request<string[]>('/api/blog/topics', {signal});
export const getBlogPost = (slug: string, signal?: AbortSignal) => request<BlogPost>(`/api/blog/posts/${encodeURIComponent(slug)}`, {signal});
export const listAdminBlogPosts = (filters: BlogFilters, signal?: AbortSignal) => request<BlogPage<AdminBlogSummary>>(`/api/admin/blog/posts?${queryString(filters)}`, {signal});
export const getAdminBlogPost = (id: number, signal?: AbortSignal) => request<AdminBlogPost>(`/api/admin/blog/posts/${id}`, {signal});
export const saveBlogPost = (input: BlogInput, post?: AdminBlogPost | null) => request<AdminBlogPost>(`/api/admin/blog/posts${post ? `/${post.id}` : ''}`, {
    method: post ? 'PUT' : 'POST', body: JSON.stringify({ ...input, ...(post ? { version: post.version } : {}) }),
});
export const archiveBlogPost = (post: AdminBlogSummary) => request<AdminBlogPost>(`/api/admin/blog/posts/${post.id}`, {
    method: 'DELETE', body: JSON.stringify({ version: post.version }),
});
export function uploadBlogCover(post: AdminBlogPost, file: File, alt: string) {
    const data = new FormData();
    data.set('cover', file); data.set('alt', alt); data.set('version', String(post.version));
    return request<AdminBlogPost>(`/api/admin/blog/posts/${post.id}/cover`, { method: 'POST', body: data });
}
export const removeBlogCover = (post: AdminBlogPost) => request<AdminBlogPost>(`/api/admin/blog/posts/${post.id}/cover`, {
    method: 'DELETE', body: JSON.stringify({ version: post.version }),
});

export function uploadBlogContentImage(postId: number, file: File) {
    const data = new FormData();
    data.set('image', file);
    return request<{ url: string }>(`/api/admin/blog/posts/${postId}/media`, { method: 'POST', body: data });
}
