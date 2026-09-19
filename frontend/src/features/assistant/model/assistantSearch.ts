import type { AssistantDocument, AssistantDocumentKind, AssistantKnowledge, AssistantRankedDocument } from "./assistant.types";
import { hasNormalizedPhrase, isFuzzyTokenMatch, normalizeAssistantText, tokenizeAssistantText } from "./assistantText";

export const PRODUCT_KINDS = new Set<AssistantDocumentKind>(["product", "category"]);
export const SERVICE_KINDS = new Set<AssistantDocumentKind>(["service", "service-item"]);
export const isCalibrationDocument = (document: AssistantDocument): boolean => document.id.startsWith("calibration-");
export const FOLLOW_UP_TERMS = ["ese", "esa", "eso", "este", "esta", "mismo", "misma", "tambien", "precio", "costo", "cotizacion", "cotizar", "donde", "como"];

const GENERIC_QUERY_TOKENS = new Set([
    "isocal", "calibracion", "servicio", "metrologia", "producto", "catalogo", "venta", "compra", "stock", "marca", "modelo",
    "cotizacion", "precio", "costo", "presupuesto", "mantenimiento", "diagnostico", "auditoria", "consultoria", "capacitacion",
    "curso", "herramienta", "orientador", "conversion", "equipo", "equipos", "instrumento", "instrumentos", "informacion", "consulta", "tecnica", "tecnico",
    "necesito", "queremos", "quiero", "pueden", "puedo", "podemos", "hacen", "saber", "confirmar", "confirma", "figura", "existe", "capacidad", "relacionada", "relacionado", "relacionados",
    "magnitud", "area", "revisar", "solicito", "solicitar", "solicitud", "pedir", "datos", "indicar",
    "operacion", "conocer", "trabaja", "trabajan", "alcance", "contempla", "contemplar", "favor", "nombre", "posible", "error", "reconocen", "reconocer", "dentro",
    "hola", "puede", "tenemos", "tengo", "estoy", "busco", "buscar", "buscando", "escribi", "quisiera", "antes", "despues", "figura", "figuran",
    "portafolio", "publicado", "publicada", "antes", "todavia", "solo", "detalle", "detallada", "corresponde", "planta", "contacto", "urgente", "urgencia", "metrologico", "metrologica",
    "preventivo", "correctivo", "reparacion", "ensayo", "caracterizacion", "taller", "formacion", "implementacion", "certificacion", "interna", "interno",
]);

const SHORT_TECHNICAL_TOKENS = new Set(["co", "no", "o2", "o3", "ph"]);

const BROAD_EVIDENCE_TOKENS = new Set([
    "iso", "electrica", "electrico", "electricidad", "industrial", "industriales", "seguridad", "laboratorio", "laboratorios",
    "control", "medicion", "mediciones", "medidor", "medidores", "energia", "temperatura", "presion", "longitud", "angulo",
    "fuerza", "torque", "humedad", "volumen", "masa", "tiempo", "frecuencia", "velocidad", "fotometria", "acustica",
    "gas", "gases", "flujo", "caudal", "salud", "calidad", "ambiental", "ambiente", "portatil",
    "psi", "bar", "pa", "kpa", "mpa", "mbar", "atm", "celsius", "fahrenheit", "kelvin",
]);

function isShortTechnicalTokenAllowed(term: string, query: string): boolean {
    if (!SHORT_TECHNICAL_TOKENS.has(term)) return false;
    if (term === "no" || term === "co") return new RegExp(`\\b${term.toUpperCase()}\\b`).test(query);
    return true;
}

export function specificQueryTokens(query: string): string[] {
    return tokenizeAssistantText(query, false).filter((term) => {
        const isMeaningfulStandardCode = /^\d{4,5}$/.test(term);
        const isGenericNumber = /^\d+(?:[./-]\d+)*$/.test(term) && !isMeaningfulStandardCode;
        const hasUsefulLength = term.length >= 3 || isShortTechnicalTokenAllowed(term, query);
        return hasUsefulLength && !isGenericNumber && !GENERIC_QUERY_TOKENS.has(term);
    });
}

export function concreteEntityTerms(query: string): string[] {
    return specificQueryTokens(query).filter((term) => !BROAD_EVIDENCE_TOKENS.has(term));
}

export function hasSpecificEvidence(query: string, document: AssistantDocument): boolean {
    const normalizedQuery = normalizeAssistantText(query);
    const normalizedTitle = normalizeAssistantText(document.title);

    if (normalizedTitle.length >= 3 && normalizedQuery.includes(normalizedTitle)) return true;

    const specifics = specificQueryTokens(query);
    if (specifics.length === 0) return true;
    const documentTokens = tokenizeAssistantText(`${document.title} ${document.keywords.join(" ")} ${document.body}`, false);

    const matchesTerm = (term: string): boolean => {
        const expanded = tokenizeAssistantText(term, true);
        return expanded.some((candidateTerm) =>
            documentTokens.includes(candidateTerm)
            || documentTokens.some((candidate) => isFuzzyTokenMatch(candidateTerm, candidate)),
        );
    };

    const matched = specifics.filter(matchesTerm);
    if (matched.length === 0) return false;

    const entityTerms = concreteEntityTerms(query);
    if (entityTerms.length === 0) return true;
    const maxLength = Math.max(...entityTerms.map((term) => term.length));
    const anchors = entityTerms.filter((term) => term.length >= maxLength * 0.65);
    return anchors.every(matchesTerm);
}

function titleAndKeywordText(document: AssistantDocument): string {
    return `${document.title} ${document.keywords.join(" ")}`;
}

export function rankAssistantDocuments(query: string, knowledge: AssistantKnowledge): AssistantRankedDocument[] {
    const normalizedQuery = normalizeAssistantText(query);
    const rawQueryTokens = tokenizeAssistantText(query);
    const discriminativeTokens = rawQueryTokens.filter((term) => !GENERIC_QUERY_TOKENS.has(term));
    const queryTokens = discriminativeTokens.length > 0 ? discriminativeTokens : rawQueryTokens;
    if (!normalizedQuery || queryTokens.length === 0) return [];

    const ranked: AssistantRankedDocument[] = [];
    for (const document of knowledge.documents) {
        const normalizedTitle = normalizeAssistantText(document.title);
        const titleTokens = tokenizeAssistantText(document.title, false);
        const keywordTokens = tokenizeAssistantText(document.keywords.join(" "), false);
        const bodyTokens = tokenizeAssistantText(document.body, false);
        const matchedTerms = new Set<string>();
        let score = 0;
        const exactTitle = normalizedTitle === normalizedQuery;

        if (exactTitle) score += 120;
        else if (normalizedTitle.startsWith(`${normalizedQuery} `) || normalizedTitle.endsWith(` ${normalizedQuery}`)) score += 65;
        else if (normalizedTitle.includes(normalizedQuery) && normalizedQuery.length >= 4) score += 45;
        else if (normalizedQuery.includes(normalizedTitle) && normalizedTitle.length >= 4 && normalizedTitle !== "isocal") score += 36;

        for (const term of queryTokens) {
            if (titleTokens.includes(term)) { score += 18; matchedTerms.add(term); continue; }
            if (keywordTokens.includes(term)) { score += 11; matchedTerms.add(term); continue; }
            if (bodyTokens.includes(term)) { score += 5; matchedTerms.add(term); continue; }

            const fuzzyTitle = titleTokens.some((candidate) => isFuzzyTokenMatch(term, candidate));
            if (fuzzyTitle) { score += 11; matchedTerms.add(term); continue; }
            const fuzzyKeyword = keywordTokens.some((candidate) => isFuzzyTokenMatch(term, candidate));
            if (fuzzyKeyword) { score += 7; matchedTerms.add(term); }
        }

        if (hasNormalizedPhrase(titleAndKeywordText(document), normalizedQuery)) score += 20;
        if (matchedTerms.size >= 2) score += Math.min(18, matchedTerms.size * 4);
        if (document.kind === "service-item" && exactTitle) score += 15;
        if (score > 0) ranked.push({ document, score, exactTitle, matchedTerms: [...matchedTerms] });
    }

    return ranked.sort((left, right) => right.score - left.score || left.document.title.localeCompare(right.document.title));
}

