import type { AssistantDocument, AssistantKnowledge, AssistantLink, AssistantRankedDocument } from "../assistant.types";
import { normalizeAssistantText } from "../assistantText";
import { SERVICE_KINDS, concreteEntityTerms, hasSpecificEvidence, isCalibrationDocument, specificQueryTokens } from "../assistantSearch";
import { bulletList, cardsFromDocuments, documentLinks, paragraph, topByKind, uniqueLinks } from "../assistantResponseUtils";

export function productResponse(ranked: readonly AssistantRankedDocument[], query: string, knowledge: AssistantKnowledge, contextDocument?: AssistantDocument): { text: string; links: AssistantLink[]; cards?: ReturnType<typeof cardsFromDocuments>; context?: AssistantDocument } {
    const products = topByKind(ranked, new Set(["product"]), 10).filter((item) => hasSpecificEvidence(query, item.document));
    const categories = topByKind(ranked, new Set(["category"]), 14).filter((item) => hasSpecificEvidence(query, item.document));
    const hasConcreteEntity = concreteEntityTerms(query).length > 0;
    const services = topByKind(ranked, SERVICE_KINDS, 10).filter((item) =>
        isCalibrationDocument(item.document)
        && (!hasConcreteEntity || item.document.kind === "service-item")
        && hasSpecificEvidence(query, item.document),
    );
    const normalized = normalizeAssistantText(query);
    const asksPrice = ["precio", "costo", "cuesta", "cotizacion", "presupuesto"].some((term) => normalized.includes(term));
    const asksBrands = /\bmarcas\b/.test(normalized) || /\b(que|cuales) marca\b/.test(normalized);
    if (asksBrands) {
        const brandsDocument = knowledge.documents.find((document) => document.id === "company-brands");
        if (brandsDocument) {
            return {
                text: paragraph(
                    "Sí encuentro marcas publicadas dentro del portafolio de ISOCAL.",
                    bulletList([
                        brandsDocument.body,
                        "La disponibilidad exacta de cada equipo se confirma desde el catálogo y mediante cotización.",
                    ]),
                ),
                links: [{ label: "Explorar catálogo", href: "/productos", kind: "primary" }],
                cards: cardsFromDocuments([brandsDocument], knowledge, 1),
                context: brandsDocument,
            };
        }
    }
    const fallbackProduct = contextDocument?.kind === "product" ? contextDocument : undefined;
    const primary = products[0]?.document ?? fallbackProduct;

    if (!primary && specificQueryTokens(query).length === 0) {
        const categoryNames = knowledge.categories.slice(0, 7).map((category) => category.name);
        const catalogSummary = knowledge.sources.products
            ? (knowledge.products.length > 0
                ? `El catálogo cargado actualmente contiene **${knowledge.products.length} productos**${categoryNames.length ? ` distribuidos en categorías como ${categoryNames.join(", ")}` : ""}.`
                : "El catálogo público respondió correctamente, pero actualmente no devolvió productos publicados.")
            : "En este momento no pude sincronizar el catálogo dinámico, así que no voy a usar una falla de conexión para afirmar que un producto no existe.";
        return {
            text: paragraph(
                catalogSummary,
                bulletList([
                    "Dime un equipo, marca, magnitud o uso concreto y buscaré únicamente entre información confirmada.",
                    "También puedes abrir el catálogo público para explorar todos los productos publicados.",
                ]),
            ),
            links: [{ label: "Explorar catálogo", href: "/productos", kind: "primary" }, { label: "Solicitar cotización", href: "/cotizacion", kind: "secondary" }],
            cards: cardsFromDocuments([
                knowledge.documents.find((document) => document.id === "search-tool"),
                knowledge.documents.find((document) => document.id === "quotation-process"),
            ], knowledge, 2),
        };
    }

    if (primary) {
        const relatedProducts = products.filter((item) => item.document.id !== primary.id).slice(0, 2).map((item) => item.document.title);
        const relatedService = services[0]?.document;
        const parts = [
            `Sí encuentro **${primary.title}** en el catálogo publicado de ISOCAL.`,
            bulletList([
                primary.body,
                relatedProducts.length ? `Opciones relacionadas: ${relatedProducts.join(" y ")}.` : null,
                relatedService ? `Servicio relacionado: **${relatedService.title}**.` : null,
                asksPrice ? "El catálogo no publica un precio fijo: modelo, disponibilidad y condiciones se confirman mediante cotización." : null,
            ]),
        ];
        return {
            text: paragraph(...parts),
            links: uniqueLinks([
                { label: `Ver ${primary.title}`, href: primary.href ?? "/productos", kind: "primary" },
                ...(relatedService?.href ? [{ label: "Ver servicio relacionado", href: relatedService.href, kind: "secondary" as const }] : []),
                { label: "Solicitar cotización", href: "/cotizacion", kind: "secondary" },
            ]),
            cards: cardsFromDocuments([primary, ...products.slice(1, 3).map((item) => item.document), relatedService], knowledge),
            context: primary,
        };
    }

    if (categories[0]) {
        const category = categories[0].document;
        return {
            text: paragraph(
                `Encontré la categoría **${category.title}** en el catálogo de ISOCAL.`,
                bulletList([
                    category.body,
                    "Puedes abrir la categoría para revisar los productos relacionados.",
                ]),
            ),
            links: documentLinks(categories, 1),
            cards: cardsFromDocuments([category], knowledge, 1),
            context: category,
        };
    }

    if (services[0]) {
        const service = services[0].document;
        const catalogStatus = knowledge.sources.products
            ? "No encuentro esa consulta como un producto publicado en el catálogo actual."
            : "No pude sincronizar el catálogo dinámico, por lo que no puedo confirmar ni descartar que ese equipo se comercialice.";
        return {
            text: paragraph(
                `${catalogStatus} Sí encuentro una capacidad técnica relacionada.`,
                bulletList([
                    `Servicio relacionado: **${service.title}**.`,
                    service.body,
                    "Para no inventar disponibilidad comercial, conviene confirmar el equipo exacto directamente con ISOCAL.",
                ]),
            ),
            links: uniqueLinks([...documentLinks(services, 1), { label: "Consultar a ISOCAL", href: "/contacto", kind: "secondary" }]),
            cards: cardsFromDocuments([service, knowledge.documents.find((document) => document.id === "company-contact")], knowledge, 2),
            context: service,
        };
    }

    if (!knowledge.sources.products) {
        return {
            text: paragraph(
                "En este momento no pude sincronizar el catálogo dinámico.",
                bulletList([
                    "No puedo confirmar ni descartar que ese producto esté publicado.",
                    "Prefiero indicarte la indisponibilidad de la fuente antes que convertir un error de red en una respuesta comercial falsa.",
                ]),
            ),
            links: [{ label: "Explorar catálogo", href: "/productos", kind: "primary" }, { label: "Consultar a ISOCAL", href: "/contacto", kind: "secondary" }],
            cards: cardsFromDocuments([
                knowledge.documents.find((document) => document.id === "search-tool"),
                knowledge.documents.find((document) => document.id === "company-contact"),
            ], knowledge, 2),
        };
    }

    return {
        text: paragraph(
            "No encuentro un producto publicado que coincida con esa descripción.",
            bulletList([
                "Prefiero no afirmar que ISOCAL lo vende si no aparece en el catálogo actual.",
                "Si tienes una marca, modelo o uso específico, puedo intentar una búsqueda más precisa.",
            ]),
        ),
        links: [{ label: "Explorar catálogo", href: "/productos", kind: "primary" }, { label: "Consultar a ISOCAL", href: "/contacto", kind: "secondary" }],
        cards: cardsFromDocuments([
            knowledge.documents.find((document) => document.id === "search-tool"),
            knowledge.documents.find((document) => document.id === "company-contact"),
        ], knowledge, 2),
    };
}
