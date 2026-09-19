import { listBlogPosts } from "../../blog/api/blog.api";
import type { BlogSummary } from "../../blog/model/blog.types";
import { listPublicCategories } from "../../categories/api/publicCategories.api";
import type { PublicCategory } from "../../categories/types/category.types";
import { listPublicProducts } from "../../products/api/publicProducts.api";
import type { PublicProduct } from "../../products/types/product.types";
import type { AssistantKnowledge } from "../model/assistant.types";
import { buildAssistantKnowledge } from "./assistantKnowledge";

let cachedKnowledge: AssistantKnowledge | null = null;
let activeLoad: Promise<AssistantKnowledge> | null = null;

async function listAllPublishedBlogPosts(): Promise<readonly BlogSummary[]> {
    const first = await listBlogPosts({ page: 1, pageSize: 50 });
    if (first.totalPages <= 1) return first.items;

    const remaining = await Promise.all(
        Array.from({ length: first.totalPages - 1 }, (_, index) =>
            listBlogPosts({ page: index + 2, pageSize: 50 }),
        ),
    );
    return [first, ...remaining].flatMap((page) => page.items);
}

export function getStaticAssistantKnowledge(): AssistantKnowledge {
    return buildAssistantKnowledge();
}

export function loadAssistantKnowledge(): Promise<AssistantKnowledge> {
    if (cachedKnowledge) return Promise.resolve(cachedKnowledge);
    if (activeLoad) return activeLoad;

    activeLoad = Promise.allSettled([
        listPublicProducts(),
        listPublicCategories(),
        listAllPublishedBlogPosts(),
    ]).then((results) => {
        const products: readonly PublicProduct[] = results[0].status === "fulfilled" ? results[0].value : [];
        const categories: readonly PublicCategory[] = results[1].status === "fulfilled" ? results[1].value : [];
        const articles: readonly BlogSummary[] = results[2].status === "fulfilled" ? results[2].value : [];
        cachedKnowledge = buildAssistantKnowledge(products, categories, articles, {
            products: results[0].status === "fulfilled",
            categories: results[1].status === "fulfilled",
            articles: results[2].status === "fulfilled",
        });
        return cachedKnowledge;
    }).finally(() => {
        activeLoad = null;
    });

    return activeLoad;
}
