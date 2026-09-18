import { useCallback } from "react";
import { listBlogPosts } from "../api/blog.api";
import type { BlogFilters } from '../model/blog.types';
import { useBlogResource } from "./useBlogResource";

export function useBlogPosts({ q = '', topic = '', page = 1, pageSize = 12 }: BlogFilters = {}, enabled = true) {
    return useBlogResource(useCallback((signal: AbortSignal) => enabled ? listBlogPosts({ q, topic, page, pageSize }, signal)
        : Promise.resolve({ items: [], total: 0, page: 1, pageSize, totalPages: 0 }), [q, topic, page, pageSize, enabled]));
}
