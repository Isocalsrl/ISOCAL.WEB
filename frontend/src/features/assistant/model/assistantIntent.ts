import type { AssistantConversationContext, AssistantIntent, AssistantRankedDocument } from "./assistant.types";
import { hasNormalizedPhrase, normalizeAssistantText, tokenizeAssistantText } from "./assistantText";
import { FOLLOW_UP_TERMS, PRODUCT_KINDS, SERVICE_KINDS, hasSpecificEvidence, isCalibrationDocument, specificQueryTokens } from "./assistantSearch";

interface IntentRule {
    intent: AssistantIntent;
    phrases: readonly string[];
    tokens: readonly string[];
}

const INTENT_RULES: readonly IntentRule[] = [
    { intent: "greeting", phrases: ["buenos dias", "buenas tardes", "buenas noches", "que tal"], tokens: ["hola", "buenas", "hey"] },
    { intent: "help", phrases: ["que puedes hacer", "en que me puedes ayudar", "como funciona"], tokens: ["ayuda", "opciones"] },
    { intent: "contact", phrases: ["como los contacto", "donde estan", "numero de telefono", "correo de ventas"], tokens: ["contacto", "telefono", "whatsapp", "correo", "email", "ubicacion", "direccion", "ruc"] },
    { intent: "accreditation", phrases: ["estan acreditados", "tienen acreditacion", "iso 17025", "iso/iec 17025"], tokens: ["acreditacion", "inacal", "a2la", "pjla", "17025"] },
    { intent: "quotation", phrases: ["solicitar cotizacion", "quiero cotizar", "cuanto cuesta", "que precio", "pedir presupuesto"], tokens: ["cotizacion", "precio", "costo", "presupuesto", "cotizar"] },
    { intent: "calibration", phrases: ["servicio de calibracion", "pueden calibrar", "calibran", "necesito calibrar"], tokens: ["calibracion", "calibrar", "metrologia", "magnitud"] },
    { intent: "maintenance", phrases: ["mantenimiento preventivo", "mantenimiento correctivo", "reparan equipos"], tokens: ["mantenimiento", "diagnostico", "reparacion", "preventivo", "correctivo"] },
    { intent: "consulting", phrases: ["implementacion iso", "sistema de gestion", "consultoria iso"], tokens: ["consultoria", "implementacion", "certificacion", "implementar"] },
    { intent: "training", phrases: ["dictan cursos", "dan capacitaciones", "curso de"], tokens: ["capacitacion", "curso", "taller", "formacion"] },
    { intent: "audit", phrases: ["auditoria interna", "auditoria de diagnostico"], tokens: ["auditoria", "auditor", "diagnostico"] },
    { intent: "product", phrases: ["que productos", "que venden", "tienen en venta", "quiero comprar", "tienen stock", "que marcas"], tokens: ["producto", "catalogo", "venta", "compra", "stock", "marca", "modelo", "alquiler", "alquilar", "renta"] },
    { intent: "conversion", phrases: ["convertir unidades", "a cuantos", "equivale a", "cuantos son"], tokens: ["conversion", "convertir", "equivale"] },
    { intent: "tools", phrases: ["orientador tecnico", "herramientas tecnicas", "que servicio necesito"], tokens: ["herramienta", "orientador", "conversor"] },
    { intent: "favorites", phrases: ["guardar producto", "mis favoritos"], tokens: ["favorito", "guardar"] },
    { intent: "blog", phrases: ["tienen articulos", "quiero leer", "blog sobre"], tokens: ["blog", "articulo", "leer", "noticia"] },
    { intent: "navigation", phrases: ["donde encuentro", "como llego", "ir a la pagina"], tokens: ["pagina", "seccion", "menu", "navegar"] },
    { intent: "company", phrases: ["quienes son", "que es isocal", "a que se dedican", "que sectores atienden", "laboratorios aliados", "red de laboratorios"], tokens: ["empresa", "isocal", "mision", "vision", "sector", "politica", "red"] },
];

function scoreIntent(query: string, rule: IntentRule): number {
    const normalized = normalizeAssistantText(query);
    const tokens = new Set(tokenizeAssistantText(query, false));
    let score = 0;
    for (const phrase of rule.phrases) if (hasNormalizedPhrase(normalized, phrase)) score += 9 + phrase.split(" ").length;
    for (const token of rule.tokens) {

        const canonical = tokenizeAssistantText(token, false)[0] ?? normalizeAssistantText(token);
        if (tokens.has(canonical)) score += 4;
    }
    return score;
}

export function classifyAssistantIntent(query: string): { intent: AssistantIntent; score: number } {
    const scores = INTENT_RULES.map((rule) => ({ intent: rule.intent, score: scoreIntent(query, rule) }))
        .sort((left, right) => right.score - left.score);
    const best = scores[0];
    if (!best || best.score <= 0) return { intent: "unknown", score: 0 };
    return best;
}

function hasExplicitCalibrationLanguage(query: string): boolean {
    const normalized = normalizeAssistantText(query);

    return /\bcalibr(?:ar|an|amos|ado|ada|acion|aciones)\b/.test(normalized)
        || hasNormalizedPhrase(normalized, "servicio de calibracion")
        || hasNormalizedPhrase(normalized, "servicios de calibracion");
}

function hasNegatedQuotationLanguage(query: string): boolean {
    const normalized = normalizeAssistantText(query);
    return [
        "no necesito precio", "sin precio", "no quiero precio", "no necesito cotizacion",
        "no quiero cotizacion", "no quiero cotizar", "no necesito cotizar", "precio no",
        "antes de cotizar", "antes de pedir cotizacion", "todavia no quiero cotizar",
    ].some((phrase) => hasNormalizedPhrase(normalized, phrase));
}

const SUPPORTED_STANDARD_CODES = ["17025", "17020", "15189", "9001", "14001", "45001"] as const;

export function mentionedStandardCode(query: string): string | null {
    const normalized = normalizeAssistantText(query);
    return SUPPORTED_STANDARD_CODES.find((code) => new RegExp(`\\b${code}\\b`).test(normalized)) ?? null;
}

export function asksCredentialStatus(query: string): boolean {
    const normalized = normalizeAssistantText(query);
    return /\b(certificad[oa]s?|certificacion|acreditad[oa]s?|acreditacion)\b/.test(normalized)
        && (/\b(isocal|ustedes|empresa|estan|tienen|cuentan)\b/.test(normalized) || normalized.split(" ").length <= 6);
}

export function isServiceOverviewQuery(query: string): boolean {
    const normalized = normalizeAssistantText(query);
    if (!/\bservicios?\b/.test(normalized)) return false;
    const specifics = specificQueryTokens(query);
    return specifics.length === 0 || [
        "que servicios ofrecen", "que servicios tienen", "cuales son sus servicios", "servicios de isocal", "servicios",
    ].some((phrase) => hasNormalizedPhrase(normalized, phrase));
}

export function isGenericCalibrationQuery(query: string): boolean {
    if (!hasExplicitCalibrationLanguage(query)) return false;
    return specificQueryTokens(query).length === 0;
}

function explicitServiceIntent(query: string): "maintenance" | "consulting" | "training" | "audit" | null {
    const normalized = normalizeAssistantText(query);
    if (/\b(curso|cursos|capacitacion|capacitaciones|taller|talleres|formacion)\b/.test(normalized)) return "training";
    if (/\b(auditoria|auditorias|auditor|auditores)\b/.test(normalized)) return "audit";
    if (/\b(consultoria|consultorias|implementar|implementacion|sistema de gestion)\b/.test(normalized)) return "consulting";
    if (/\b(mantenimiento|reparacion|reparar|preventivo|correctivo)\b/.test(normalized)) return "maintenance";
    return null;
}

export function selectIntent(query: string, ranked: readonly AssistantRankedDocument[], context: AssistantConversationContext): AssistantIntent {
    const classified = classifyAssistantIntent(query);
    const top = ranked[0];
    const normalized = normalizeAssistantText(query);
    const hasProductCue = scoreIntent(query, INTENT_RULES.find((rule) => rule.intent === "product")!) >= 4;
    const hasCalibrationCue = hasExplicitCalibrationLanguage(query);
    const quotationIsNegated = hasNegatedQuotationLanguage(query);
    const explicitService = explicitServiceIntent(query);
    const strongProduct = ranked.find((item) => {
        if (item.document.kind !== "product") return false;
        const title = normalizeAssistantText(item.document.title);
        return item.exactTitle || (title.length >= 4 && normalized.includes(title)) || (item.score >= 45 && hasSpecificEvidence(query, item.document));
    });

    const directTokens = tokenizeAssistantText(query, false);
    const standardCode = mentionedStandardCode(query);
    const explicitQuotationAction = /\b(cotizacion|cotizar|presupuesto)\b/.test(normalized);
    const asksRecommendedService = [
        "que servicio necesito",
        "que servicio seria",
        "que servicio corresponde",
        "que servicio aplica",
        "que servicio recomiendan",
    ].some((phrase) => hasNormalizedPhrase(normalized, phrase));
    const suggestedCalibrationService = ranked.find((item) =>
        SERVICE_KINDS.has(item.document.kind)
        && isCalibrationDocument(item.document)
        && item.score >= 10
        && hasSpecificEvidence(query, item.document),
    );
    const quotationHasDomainEvidence = Boolean(
        context.lastProductId
        || context.lastDocumentId
        || (top && top.score >= 10 && hasSpecificEvidence(query, top.document)),
    );
    const quotationAllowed = !quotationIsNegated && (explicitQuotationAction || quotationHasDomainEvidence);
    if (classified.intent === "greeting" && directTokens.length <= 2) return "greeting";
    if (classified.intent === "conversion") return "conversion";
    if (classified.intent === "quotation" && classified.score >= 4 && quotationAllowed) return "quotation";
    if (explicitService) return explicitService;
    if (hasCalibrationCue) return "calibration";
    if (asksRecommendedService && suggestedCalibrationService) return "calibration";
    if (standardCode) return "standards";
    if (isServiceOverviewQuery(query)) return "help";
    if (classified.intent === "help" && classified.score >= 8) return "help";
    if (classified.score >= 8 && !["product", "calibration", "quotation"].includes(classified.intent)) return classified.intent;
    if (strongProduct) return "product";
    if (hasProductCue) return "product";
    if (top?.score && top.score >= 18 && hasSpecificEvidence(query, top.document)) {
        if (PRODUCT_KINDS.has(top.document.kind) && top.score >= 24) return "product";
        if (SERVICE_KINDS.has(top.document.kind)) {
            if (top.document.id.startsWith("training-")) return "training";
            if (top.document.id.startsWith("audit")) return "audit";
            if (top.document.id === "maintenance" || top.document.id === "testing") return "maintenance";
            if (top.document.id === "consulting") return "consulting";
            return "calibration";
        }
        if (top.document.kind === "article") return "blog";
        if (top.document.kind === "tool") return top.document.id.startsWith("converter-") ? "conversion" : "tools";
        if (top.document.kind === "contact") return "contact";
        if (top.document.kind === "company") return top.document.id === "company-accreditation" ? "accreditation" : "company";
    }
    if (classified.score >= 4 && !(classified.intent === "quotation" && !quotationAllowed)) return classified.intent;
    if (context.lastIntent && FOLLOW_UP_TERMS.some((term) => normalized.includes(term))) return context.lastIntent;
    return "unknown";
}
