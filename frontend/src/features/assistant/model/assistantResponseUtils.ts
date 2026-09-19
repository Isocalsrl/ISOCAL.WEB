import type { BlogSummary } from "../../blog/model/blog.types";
import type { PublicCategory } from "../../categories/types/category.types";
import type { PublicProduct } from "../../products/types/product.types";
import type { AssistantConversationContext, AssistantDocument, AssistantDocumentKind, AssistantFact, AssistantKnowledge, AssistantLink, AssistantRankedDocument, AssistantResourceCard } from "./assistant.types";

export function confidenceFrom(score: number, intentScore: number): number {
    if (score >= 100) return 99;
    if (score >= 70) return 96;
    if (score >= 45) return 91;
    if (score >= 30) return 84;
    if (score >= 20) return 76;
    if (intentScore >= 10) return 88;
    if (intentScore >= 4) return 73;
    return 45;
}

export function uniqueLinks(links: readonly AssistantLink[]): AssistantLink[] {
    const seen = new Set<string>();
    return links.filter((link) => {
        if (seen.has(link.href)) return false;
        seen.add(link.href);
        return true;
    }).slice(0, 3);
}

export function paragraph(...parts: readonly (string | null | undefined | false)[]): string {
    return parts.filter(Boolean).join("\n\n");
}

export function bulletList(items: readonly (string | null | undefined | false)[]): string {
    return items.filter(Boolean).map((item) => `- ${item}`).join("\n");
}

export function trimSentence(text: string | null | undefined, maxLength = 148): string {
    const value = (text ?? "").replace(/\s+/g, " ").trim();
    if (!value) return "";
    if (value.length <= maxLength) return value;
    return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function documentLinks(items: readonly AssistantRankedDocument[], limit = 2): AssistantLink[] {
    return items.filter((item) => item.document.href).slice(0, limit).map((item, index) => ({
        label: item.document.title,
        href: item.document.href!,
        kind: index === 0 ? "primary" : "secondary",
    }));
}

export function topByKind(ranked: readonly AssistantRankedDocument[], kinds: ReadonlySet<AssistantDocumentKind>, minScore = 16): AssistantRankedDocument[] {
    return ranked.filter((item) => kinds.has(item.document.kind) && item.score >= minScore);
}

function cardMetaFromProduct(category?: PublicCategory): string {
    if (category?.name) return `Catálogo • ${category.name}`;
    return "Catálogo ISOCAL";
}

function cardMetaFromArticle(article: BlogSummary): string {
    const minutes = article.readingMinutes ? `${article.readingMinutes} min de lectura` : "Artículo técnico";
    return ["Blog", article.topic, minutes].filter(Boolean).join(" • ");
}

function eyebrowFromDocument(document: AssistantDocument): string {
    switch (document.kind) {
        case "product": return "Producto";
        case "category": return "Categoría";
        case "service":
        case "service-item": return "Servicio";
        case "tool": return "Herramienta";
        case "article": return "Artículo";
        case "contact": return "Contacto";
        case "process": return "Proceso";
        case "company": return "ISOCAL";
        case "page": return "Sección";
        default: return "Recurso";
    }
}

function kindFromDocument(document: AssistantDocument): AssistantResourceCard["kind"] {
    switch (document.kind) {
        case "product": return "product";
        case "category": return "category";
        case "service":
        case "service-item": return "service";
        case "tool": return "tool";
        case "article": return "article";
        case "contact": return "contact";
        case "process": return "process";
        case "page": return "page";
        case "company":
        default: return "company";
    }
}

function ctaFromDocument(document: AssistantDocument): string {
    switch (document.kind) {
        case "product": return "Ver producto";
        case "service":
        case "service-item": return "Ver servicio";
        case "tool": return "Abrir herramienta";
        case "article": return "Leer artículo";
        case "contact": return "Abrir contacto";
        case "process": return "Ver proceso";
        case "category": return "Ver categoría";
        case "page": return "Ir a sección";
        case "company":
        default: return "Más información";
    }
}

function categoryById(knowledge: AssistantKnowledge, id: number | null | undefined): PublicCategory | undefined {
    if (!id) return undefined;
    return knowledge.categories.find((category) => category.id === id);
}

function productByDocument(document: AssistantDocument, knowledge: AssistantKnowledge): PublicProduct | undefined {
    if (!document.productId) return undefined;
    return knowledge.products.find((product) => product.id === document.productId);
}

function articleByDocument(document: AssistantDocument, knowledge: AssistantKnowledge): BlogSummary | undefined {
    const slug = document.href?.replace(/^\/blog\//, "");
    if (!slug || slug === document.href) return undefined;
    return knowledge.articles.find((article) => article.slug === slug);
}

export function cardFromDocument(document: AssistantDocument, knowledge: AssistantKnowledge): AssistantResourceCard | null {
    const href = document.href;
    if (!href) return null;

    const product = productByDocument(document, knowledge);
    if (product) {
        const category = categoryById(knowledge, product.categoryId);
        return {
            id: document.id,
            kind: "product",
            eyebrow: category?.name ? `Producto • ${category.name}` : "Producto",
            title: product.name,
            description: trimSentence(product.description ?? document.body, 156),
            href,
            meta: cardMetaFromProduct(category),
            ctaLabel: "Ver producto",
            imageUrl: product.imageUrl,
        };
    }

    const article = articleByDocument(document, knowledge);
    if (article) {
        return {
            id: document.id,
            kind: "article",
            eyebrow: "Blog técnico",
            title: article.title,
            description: trimSentence(article.excerpt, 156),
            href,
            meta: cardMetaFromArticle(article),
            ctaLabel: "Leer artículo",
            imageUrl: article.coverUrl,
        };
    }

    return {
        id: document.id,
        kind: kindFromDocument(document),
        eyebrow: eyebrowFromDocument(document),
        title: document.title,
        description: trimSentence(document.body, 156),
        href,
        meta: document.group,
        ctaLabel: ctaFromDocument(document),
    };
}

export function cardsFromDocuments(documents: readonly (AssistantDocument | undefined | null)[], knowledge: AssistantKnowledge, limit = 3): AssistantResourceCard[] {
    const seen = new Set<string>();
    const cards: AssistantResourceCard[] = [];
    for (const document of documents) {
        if (!document || seen.has(document.id)) continue;
        const card = cardFromDocument(document, knowledge);
        if (!card) continue;
        seen.add(document.id);
        cards.push(card);
        if (cards.length >= limit) break;
    }
    return cards;
}

export function contactFacts(facts: readonly AssistantFact[]): AssistantFact[] {
    return facts.filter((item) => item.value.trim().length > 0);
}

export function findContextDocument(knowledge: AssistantKnowledge, context: AssistantConversationContext): AssistantDocument | undefined {
    if (context.lastDocumentId) return knowledge.documents.find((document) => document.id === context.lastDocumentId);
    if (context.lastProductId) return knowledge.documents.find((document) => document.productId === context.lastProductId);
    return undefined;
}
