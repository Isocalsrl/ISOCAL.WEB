import type { PublicCategory } from "../../categories/types/category.types";
import type { PublicProduct } from "../../products/types/product.types";
import { CALIBRATION_GROUPS } from "../../public-site/data/services/metrology";

export type TechnicalSearchResultKind = "product" | "category" | "service" | "tool" | "article";

export interface TechnicalSearchResult {
    id: string;
    kind: TechnicalSearchResultKind;
    title: string;
    eyebrow: string;
    description: string;
    href: string;
    score: number;
}

export const TECHNICAL_ALIASES: Readonly<Record<string, readonly string[]>> = {
    manometro: ["presion", "barometro", "transductor", "psi", "vacío", "vacio"],
    psi: ["presion", "manometro", "barometro"],
    bar: ["presion", "manometro"],
    balanza: ["masa", "peso", "pesas"],
    peso: ["masa", "balanza", "pesas"],
    termometro: ["temperatura", "termometro", "termohigrometro"],
    temperatura: ["termometro", "horno", "mufla", "camara", "autoclave"],
    humedad: ["termohigrometro", "higrometro", "psicrometro"],
    ph: ["electroquimicos", "medidor de ph"],
    luxometro: ["fotometria", "acustica", "luxometros"],
    sonometro: ["acustica", "sonometros", "fotometria"],
    multimetro: ["electricidad", "multimetros"],
    amperimetrica: ["electricidad", "pinza", "multimetro"],
    vernier: ["longitud", "angulo", "pie de rey"],
    micrometro: ["longitud", "angulo"],
    torque: ["fuerza", "torquimetro", "dinamometro"],
    caudal: ["flujo", "caudalimetro", "rotametro"],
    gas: ["gases", "detector", "analizador"],
};

const SEARCH_STOP_WORDS = new Set(["de", "del", "el", "la", "los", "las", "y", "por", "para", "en", "un", "una"]);

function normalize(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9./+-]+/g, " ")
        .trim();
}

function getSearchTerms(query: string): string[] {
    const baseTerms = normalize(query)
        .split(/\s+/)
        .filter((term) => Boolean(term) && !SEARCH_STOP_WORDS.has(term));
    const expanded = new Set(baseTerms);

    for (const term of baseTerms) {
        for (const synonym of TECHNICAL_ALIASES[term] ?? []) {
            normalize(synonym)
                .split(/\s+/)
                .filter((token) => Boolean(token) && !SEARCH_STOP_WORDS.has(token))
                .forEach((token) => expanded.add(token));
        }
    }

    return [...expanded];
}

function hasPhrase(tokens: readonly string[], phrase: readonly string[]): boolean {
    if (phrase.length === 0 || phrase.length > tokens.length) return false;
    return tokens.some((_, index) => phrase.every((term, offset) => tokens[index + offset] === term));
}

export function scoreTechnicalText(query: string, terms: readonly string[], ...fields: Array<string | null | undefined>): number {
    const normalizedFields = fields.map((field) => normalize(field ?? ""));
    const fullQuery = normalize(query);
    let score = 0;

    normalizedFields.forEach((field, fieldIndex) => {
        if (!field) return;
        const weight = Math.max(1, 5 - fieldIndex);
        const fieldTokens = field.split(/\s+/).filter(Boolean);
        const queryTokens = fullQuery.split(/\s+/).filter(Boolean);
        if (field === fullQuery) score += 18 * weight;
        else if (hasPhrase(fieldTokens, queryTokens)) score += 9 * weight;

        for (const term of terms) {
            const exactToken = fieldTokens.includes(term);
            const inflectedToken = term.length >= 4 && fieldTokens.some((token) => token.startsWith(term));
            if (field === term) score += 8 * weight;
            else if (exactToken) score += 4 * weight;
            else if (inflectedToken) score += 2 * weight;
        }
    });

    return score;
}

export function buildTechnicalSearchResults(
    query: string,
    products: readonly PublicProduct[],
    categories: readonly PublicCategory[],
): TechnicalSearchResult[] {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) return [];

    const terms = getSearchTerms(trimmedQuery);
    const categoryById = new Map(categories.map((category) => [category.id, category]));
    const results: TechnicalSearchResult[] = [];

    for (const product of products) {
        const category = product.categoryId ? categoryById.get(product.categoryId) : undefined;
        const score = scoreTechnicalText(trimmedQuery, terms, product.name, category?.name, product.description);
        if (score <= 0) continue;
        const normalizedProductName = normalize(product.name);
        const normalizedQuery = normalize(trimmedQuery);
        const namePriority = normalizedProductName === normalizedQuery
            ? 240
            : normalizedProductName.startsWith(`${normalizedQuery} `) ? 180 : 0;

        results.push({
            id: `product-${product.id}`,
            kind: "product",
            title: product.name,
            eyebrow: category?.name ?? "Producto técnico",
            description: product.description ?? "Equipo disponible en el catálogo técnico de ISOCAL.",
            href: `/productos/${product.id}`,
            score: score + namePriority + 4,
        });
    }

    for (const category of categories) {
        const score = scoreTechnicalText(trimmedQuery, terms, category.name, category.description, category.slug);
        if (score <= 0) continue;

        results.push({
            id: `category-${category.id}`,
            kind: "category",
            title: category.name,
            eyebrow: "Categoría de productos",
            description: category.description ?? "Explora los equipos disponibles dentro de esta categoría.",
            href: `/productos?categoria=${category.slug}`,
            score,
        });
    }

    for (const group of CALIBRATION_GROUPS) {
        const matchingItems = group.items.filter((item) => scoreTechnicalText(trimmedQuery, terms, item) > 0);
        const score = scoreTechnicalText(trimmedQuery, terms, group.title, group.items.join(" "));
        if (score <= 0) continue;

        results.push({
            id: `service-${group.id}`,
            kind: "service",
            title: `Calibración · ${group.title}`,
            eyebrow: "Servicio metrológico",
            description: matchingItems.length > 0
                ? `Equipos relacionados: ${matchingItems.slice(0, 4).join(" · ")}`
                : `Magnitud con ${group.items.length} tipos de equipos e instrumentos dentro del portafolio.`,
            href: `/servicios#metrologia`,
            score: score + 3,
        });
    }

    const toolScore = scoreTechnicalText(
        trimmedQuery,
        terms,
        "convertidor conversor unidades psi bar pascal temperatura celsius fahrenheit kelvin masa kilogramo gramo longitud metro milimetro pulgada",
    );

    if (toolScore > 0) {
        results.push({
            id: "tool-converter",
            kind: "tool",
            title: "Conversores metrológicos",
            eyebrow: "Herramienta técnica",
            description: "Convierte presión, temperatura, masa y longitud directamente desde la web.",
            href: "/herramientas#conversores",
            score: toolScore,
        });
    }

    return results
        .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
        .slice(0, 18);
}
