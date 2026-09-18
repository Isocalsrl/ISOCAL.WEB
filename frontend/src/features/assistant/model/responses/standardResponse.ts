import { ABOUT_ACCREDITATION_BODIES } from "../../../public-site/data/about";
import type { AssistantDocument, AssistantKnowledge, AssistantLink, AssistantRankedDocument, AssistantResourceCard } from "../assistant.types";
import { normalizeAssistantText } from "../assistantText";
import { asksCredentialStatus, mentionedStandardCode } from "../assistantIntent";
import { SERVICE_KINDS } from "../assistantSearch";
import { bulletList, cardsFromDocuments, paragraph, uniqueLinks } from "../assistantResponseUtils";

export function standardResponse(query: string, ranked: readonly AssistantRankedDocument[], knowledge: AssistantKnowledge): { text: string; links: AssistantLink[]; cards?: AssistantResourceCard[]; context?: AssistantDocument } {
    const code = mentionedStandardCode(query);
    if (!code) {
        return {
            text: paragraph(
                "ISOCAL publica servicios relacionados con normas de gestión, auditoría y metrología.",
                bulletList([
                    "Normas mencionadas en el sitio: ISO/IEC 17025, ISO/IEC 17020, ISO 9001, ISO 14001, ISO 45001 e ISO 15189.",
                    "El alcance exacto depende de si buscas consultoría, capacitación, auditoría o respaldo metrológico.",
                ]),
            ),
            links: [{ label: "Ver servicios", href: "/servicios", kind: "primary" }],
            cards: cardsFromDocuments([knowledge.documents.find((document) => document.id === "consulting"), knowledge.documents.find((document) => document.id === "audit")], knowledge, 2),
        };
    }

    const accreditation = knowledge.documents.find((document) => document.id === "company-accreditation");
    const related = ranked.filter((item) => {
        if (!SERVICE_KINDS.has(item.document.kind) && item.document.kind !== "company") return false;
        return normalizeAssistantText(`${item.document.title} ${item.document.body} ${item.document.keywords.join(" ")}`).includes(code);
    });
    const hasConsulting = related.some((item) => item.document.id === "consulting" || item.document.id.startsWith("training-"));
    const hasAudit = related.some((item) => item.document.id.startsWith("audit"));
    const credentialQuestion = asksCredentialStatus(query);

    if (credentialQuestion) {
        if (code === "17025") {
            return {
                text: paragraph(
                    "La web **no afirma que ISOCAL como empresa tenga una certificación ISO/IEC 17025 propia**.",
                    bulletList([
                        `Sí publica que su red metrológica está compuesta por laboratorios acreditados por ${ABOUT_ACCREDITATION_BODIES.join(", ")}.`,
                        "También indica que los servicios de calibración se presentan como respaldados bajo ISO/IEC 17025.",
                        "Para confirmar un alcance acreditado concreto, conviene validarlo con el equipo de metrología.",
                    ]),
                ),
                links: [
                    { label: "Ver respaldo técnico", href: "/nosotros", kind: "primary" },
                    { label: "Contactar metrología", href: "/contacto", kind: "secondary" },
                ],
                cards: cardsFromDocuments([accreditation, knowledge.documents.find((document) => document.id === "company-contact")], knowledge, 2),
                context: accreditation,
            };
        }
        const services = [hasConsulting ? "consultoría/capacitación" : "", hasAudit ? "auditoría" : ""].filter(Boolean).join(" y ");
        return {
            text: paragraph(
                `No encuentro en el contenido publicado una declaración de que **ISOCAL esté certificada en ISO ${code}**.`,
                bulletList([
                    `Sí encuentro ${services || "servicios"} relacionados con esa norma.`,
                    "Distingo ambas cosas para no presentar un servicio ofrecido como si fuera una certificación propia de la empresa.",
                ]),
            ),
            links: [
                { label: "Ver servicios relacionados", href: "/servicios", kind: "primary" },
                { label: "Consultar a ISOCAL", href: "/contacto", kind: "secondary" },
            ],
            cards: cardsFromDocuments([related[0]?.document, knowledge.documents.find((document) => document.id === "company-contact")], knowledge, 2),
            context: related[0]?.document,
        };
    }

    const capabilities = [hasConsulting ? "consultoría/capacitación" : "", hasAudit ? "auditoría" : ""].filter(Boolean);
    if (code === "17025") capabilities.unshift("metrología respaldada bajo ISO/IEC 17025");
    return {
        text: capabilities.length
            ? paragraph(
                `Sí encuentro la norma **${code === "17025" || code === "17020" ? `ISO/IEC ${code}` : `ISO ${code}`}** dentro del contenido de ISOCAL.`,
                bulletList([
                    `Está relacionada con ${capabilities.join(" y ")}.`,
                    "Si me indicas si buscas implementación, capacitación, auditoría o metrología, puedo llevarte al alcance publicado correspondiente.",
                ]),
            )
            : paragraph(
                `La norma ${code} aparece en el contenido publicado, pero no encuentro suficiente detalle para atribuirle un servicio específico sin asumir información adicional.`,
            ),
        links: uniqueLinks([
            ...(hasConsulting ? [{ label: "Ver consultoría y capacitación", href: "/servicios#consultoria", kind: "primary" as const }] : []),
            ...(hasAudit ? [{ label: "Ver auditoría", href: "/servicios#auditoria", kind: hasConsulting ? "secondary" as const : "primary" as const }] : []),
            ...(code === "17025" ? [{ label: "Ver metrología", href: "/servicios#metrologia", kind: "secondary" as const }] : []),
        ]),
        cards: cardsFromDocuments(related.map((item) => item.document), knowledge, 3),
        context: related[0]?.document,
    };
}
