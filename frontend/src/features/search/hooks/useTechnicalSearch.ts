import { useMemo } from "react";
import { usePublicCatalog } from "../../products/hooks/usePublicCatalog";
import { useBlogPosts } from "../../blog/hooks/useBlogPosts";
import { buildTechnicalSearchResults, type TechnicalSearchResult } from "../model/technicalSearch";

export function useTechnicalSearch(query: string) {
    const catalog = usePublicCatalog();
    const blog = useBlogPosts({ q: query.slice(0, 160), pageSize: 6 }, query.length >= 2);
    const results = useMemo(() => [
        ...buildTechnicalSearchResults(query, catalog.products, catalog.categories),
        ...(blog.data?.items ?? []).map((post): TechnicalSearchResult => ({
            id: `article-${post.id}`, kind: 'article', title: post.title, eyebrow: post.topic,
            description: post.excerpt, href: `/blog/${post.slug}`, score: 1,
        })),
    ], [query, catalog.products, catalog.categories, blog.data]);
    return { catalog, blog, results, isLoading: catalog.isLoading || blog.isLoading };
}
