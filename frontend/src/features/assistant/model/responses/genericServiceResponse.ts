import type { AssistantDocument, AssistantKnowledge, AssistantLink, AssistantRankedDocument, AssistantResourceCard } from "../assistant.types";
import { normalizeAssistantText, tokenizeAssistantText } from "../assistantText";
import { hasSpecificEvidence } from "../assistantSearch";
import { bulletList, cardsFromDocuments, paragraph } from "../assistantResponseUtils";

export function genericServiceResponse(intent: "maintenance" | "consulting" | "training" | "audit", ranked: readonly AssistantRankedDocument[], query: string, knowledge: AssistantKnowledge): { text: string; links: AssistantLink[]; cards?: AssistantResourceCard[]; context?: AssistantDocument } {
    const matchers: Record<typeof intent, (document: AssistantDocument) => boolean> = {
        maintenance: (document) => document.id === "maintenance" || document.id === "testing",
        consulting: (document) => document.id === "consulting",
        training: (document) => document.id.startsWith("training-"),
        audit: (document) => document.id.startsWith("audit"),
    };
    const candidates = ranked.filter((item) => matchers[intent](item.document) && hasSpecificEvidence(query, item.document));
    const specific = candidates.find((item) => item.document.id !== intent && tokenizeAssistantText(query, false).some((term) => term.length >= 3 && normalizeAssistantText(item.document.body).includes(term)));
    const fallback = specific ?? candidates[0] ?? null;
    const document = fallback?.document;
    const titles: Record<typeof intent, string> = { maintenance: "mantenimiento y ensayos", consulting: "consultoría", training: "capacitación", audit: "auditoría" };
    const anchors: Record<typeof intent, string> = { maintenance: "/servicios#mantenimiento", consulting: "/servicios#consultoria", training: "/servicios#consultoria", audit: "/servicios#auditoria" };
    const toolsDocument = knowledge.documents.find((item) => item.id === "services-overview");
    return {
        text: document
            ? paragraph(
                `Sí. ISOCAL publica servicios de **${titles[intent]}**.`,
                bulletList([
                    `Alcance relacionado: **${document.title}**.`,
                    document.body,
                    "Si necesitas confirmar un caso particular, conviene detallar el equipo, la norma o el objetivo del servicio.",
                ]),
            )
            : paragraph(
                `No encuentro esa necesidad específica dentro del alcance publicado de **${titles[intent]}**.`,
                bulletList([
                    "Prefiero no afirmar una capacidad que no aparece en el sistema.",
                    "Puedes validarlo directamente con ISOCAL o revisar la sección de servicios para confirmar el alcance.",
                ]),
            ),
        links: document
            ? [{ label: `Ver ${titles[intent]}`, href: anchors[intent], kind: "primary" }, { label: "Consultar a ISOCAL", href: "/contacto", kind: "secondary" }]
            : [{ label: "Consultar a ISOCAL", href: "/contacto", kind: "primary" }],
        cards: cardsFromDocuments([document, toolsDocument], knowledge, 2),
        context: document,
    };
}
