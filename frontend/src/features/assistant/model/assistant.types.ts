import type { BlogSummary } from "../../blog/model/blog.types";
import type { PublicCategory } from "../../categories/types/category.types";
import type { PublicProduct } from "../../products/types/product.types";

export type AssistantIntent =
    | "greeting"
    | "help"
    | "company"
    | "contact"
    | "accreditation"
    | "standards"
    | "product"
    | "calibration"
    | "maintenance"
    | "consulting"
    | "training"
    | "audit"
    | "quotation"
    | "favorites"
    | "tools"
    | "conversion"
    | "blog"
    | "navigation"
    | "unknown";

export type AssistantDocumentKind =
    | "company"
    | "contact"
    | "service"
    | "service-item"
    | "product"
    | "category"
    | "tool"
    | "article"
    | "process"
    | "page";

export interface AssistantDocument {
    id: string;
    kind: AssistantDocumentKind;
    title: string;
    body: string;
    keywords: readonly string[];
    href?: string;
    group?: string;
    productId?: number;
}

export interface AssistantKnowledgeSources {
    products: boolean;
    categories: boolean;
    articles: boolean;
}

export interface AssistantKnowledge {
    documents: readonly AssistantDocument[];
    products: readonly PublicProduct[];
    categories: readonly PublicCategory[];
    articles: readonly BlogSummary[];
    sources: AssistantKnowledgeSources;
}

export interface AssistantRankedDocument {
    document: AssistantDocument;
    score: number;
    exactTitle: boolean;
    matchedTerms: readonly string[];
}

export interface AssistantLink {
    label: string;
    href: string;
    kind: "primary" | "secondary";
}

export interface AssistantFact {
    label: string;
    value: string;
    icon?: "phone" | "mail" | "pin" | "shield" | "clipboard" | "package" | "ruler" | "clock" | "info";
}

export interface AssistantResourceCard {
    id: string;
    title: string;
    description: string;
    href: string;
    kind: "product" | "service" | "tool" | "article" | "contact" | "process" | "page" | "category" | "company";
    eyebrow?: string;
    meta?: string;
    ctaLabel?: string;
    imageUrl?: string | null;
}

export interface AssistantReply {
    text: string;
    intent: AssistantIntent;
    confidence: number;
    links: readonly AssistantLink[];
    suggestions: readonly string[];
    facts?: readonly AssistantFact[];
    cards?: readonly AssistantResourceCard[];
    contextDocumentId?: string;
}

export interface AssistantConversationContext {
    lastIntent?: AssistantIntent;
    lastDocumentId?: string;
    lastProductId?: number;
}

export interface AssistantMessage {
    id: string;
    role: "assistant" | "user";
    text: string;
    links?: readonly AssistantLink[];
    confidence?: number;
    facts?: readonly AssistantFact[];
    cards?: readonly AssistantResourceCard[];
}
