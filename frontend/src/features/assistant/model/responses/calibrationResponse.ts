import { CALIBRATION_GROUPS } from "../../../public-site/data/services/metrology";
import type { AssistantDocument, AssistantKnowledge, AssistantLink, AssistantRankedDocument, AssistantResourceCard } from "../assistant.types";
import { isFuzzyTokenMatch, normalizeAssistantText, tokenizeAssistantText } from "../assistantText";
import { isGenericCalibrationQuery } from "../assistantIntent";
import { SERVICE_KINDS, concreteEntityTerms, hasSpecificEvidence, isCalibrationDocument } from "../assistantSearch";
import { bulletList, cardsFromDocuments, paragraph, topByKind, uniqueLinks } from "../assistantResponseUtils";

export function calibrationResponse(ranked: readonly AssistantRankedDocument[], query: string, knowledge: AssistantKnowledge, contextDocument?: AssistantDocument): { text: string; links: AssistantLink[]; cards?: AssistantResourceCard[]; context?: AssistantDocument } {
    if (isGenericCalibrationQuery(query) && !(contextDocument && SERVICE_KINDS.has(contextDocument.kind))) {
        const areaNames = CALIBRATION_GROUPS.map((group) => group.title);
        return {
            text: paragraph(
                `Sí. ISOCAL publica servicios de calibración en **${CALIBRATION_GROUPS.length} áreas técnicas**.`,
                bulletList([
                    `Áreas publicadas: ${areaNames.join(", ")}.`,
                    "Si me indicas el equipo, la magnitud o el rango, puedo revisar únicamente el portafolio que realmente está publicado.",
                    "No confirmaré una capacidad si no encuentro respaldo en el sistema.",
                ]),
            ),
            links: [
                { label: "Ver metrología", href: "/servicios#metrologia", kind: "primary" },
                { label: "Orientador técnico", href: "/herramientas#orientador", kind: "secondary" },
            ],
            cards: cardsFromDocuments([
                knowledge.documents.find((document) => document.id === "services-overview"),
                knowledge.documents.find((document) => document.id === "service-advisor"),
            ], knowledge, 2),
            context: undefined,
        };
    }

    const hasConcreteEntity = concreteEntityTerms(query).length > 0;
    const services = topByKind(ranked, SERVICE_KINDS, 10).filter((item) =>
        isCalibrationDocument(item.document)
        && (!hasConcreteEntity || item.document.kind === "service-item")
        && hasSpecificEvidence(query, item.document),
    );
    const products = topByKind(ranked, new Set(["product"]), 10).filter((item) => hasSpecificEvidence(query, item.document));
    const fallback = contextDocument && SERVICE_KINDS.has(contextDocument.kind) ? contextDocument : undefined;
    const primary = services[0]?.document ?? fallback;

    if (!primary) {
        return { text: "No encuentro esa capacidad de calibración dentro de los servicios publicados por ISOCAL. Para evitar darte una respuesta incorrecta, no voy a asumir que pueden realizarla.", links: [{ label: "Usar orientador técnico", href: "/herramientas#orientador", kind: "primary" }, { label: "Consultar a metrología", href: "/contacto", kind: "secondary" }] };
    }

    const groupTitle = primary.group ?? primary.title.replace(/^Calibración · /, "");
    const asksRecommendedService = [
        "que servicio necesito",
        "que servicio seria",
        "que servicio corresponde",
        "que servicio aplica",
        "que servicio recomiendan",
    ].some((phrase) => normalizeAssistantText(query).includes(phrase));
    const group = CALIBRATION_GROUPS.find((candidate) => normalizeAssistantText(candidate.title) === normalizeAssistantText(groupTitle));
    const queryNormalized = normalizeAssistantText(query);
    const matchedItems = group?.items.filter((item) => {
        const normalizedItem = normalizeAssistantText(item);
        const itemTokens = tokenizeAssistantText(item);
        return queryNormalized.includes(normalizedItem) || tokenizeAssistantText(query).some((term) => itemTokens.includes(term) || itemTokens.some((candidate) => isFuzzyTokenMatch(term, candidate)));
    }) ?? [];
    const examples = (matchedItems.length ? matchedItems : group?.items ?? []).slice(0, 5);
    const product = products[0]?.document;
    const text = paragraph(
        asksRecommendedService
            ? `Para ese equipo, el servicio publicado que mejor corresponde es **${primary.title}**.`
            : "Sí encuentro esa necesidad dentro de las capacidades publicadas de ISOCAL.",
        bulletList([
            group
                ? `Magnitud asociada: **${group.title}**${examples.length ? ` · Equipos publicados: ${examples.join(", ")}.` : "."}`
                : `Capacidad relacionada: **${primary.title}**.`,
            asksRecommendedService ? "Si compartes el rango o condición de uso, el equipo técnico puede validar el alcance final." : "La validación final del alcance, rango y condiciones del equipo la realiza el equipo técnico de ISOCAL.",
            product ? `Producto relacionado en el catálogo: **${product.title}**.` : null,
        ]),
    );
    return {
        text,
        links: uniqueLinks([
            { label: "Ver servicios de metrología", href: "/servicios#metrologia", kind: "primary" },
            ...(product?.href ? [{ label: product.title, href: product.href, kind: "secondary" as const }] : []),
            { label: "Orientador técnico", href: "/herramientas#orientador", kind: "secondary" },
        ]),
        cards: cardsFromDocuments([
            primary,
            product,
            knowledge.documents.find((document) => document.id === "service-advisor"),
        ], knowledge),
        context: primary,
    };
}
