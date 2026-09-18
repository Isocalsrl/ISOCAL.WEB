import { COMPANY } from "../../public-site/data/company";
import type { AssistantConversationContext, AssistantDocument, AssistantFact, AssistantKnowledge, AssistantLink, AssistantReply, AssistantResourceCard } from "./assistant.types";
import { normalizeAssistantText } from "./assistantText";
import { classifyAssistantIntent, isServiceOverviewQuery, selectIntent } from "./assistantIntent";
import { extractConversion, formatNumber } from "./assistantConversion";
import { calibrationResponse, genericServiceResponse, productResponse, standardResponse } from "./assistantResponses";
import { concreteEntityTerms, hasSpecificEvidence, isCalibrationDocument, rankAssistantDocuments, SERVICE_KINDS, specificQueryTokens } from "./assistantSearch";
import { bulletList, cardsFromDocuments, confidenceFrom, contactFacts, documentLinks, findContextDocument, paragraph, uniqueLinks } from "./assistantResponseUtils";

export function answerAssistantQuery(query: string, knowledge: AssistantKnowledge, context: AssistantConversationContext = {}): AssistantReply {
    const trimmed = query.trim().slice(0, 500);
    const ranked = rankAssistantDocuments(trimmed, knowledge);
    const classified = classifyAssistantIntent(trimmed);
    const intent = selectIntent(trimmed, ranked, context);
    const contextDocument = findContextDocument(knowledge, context);
    const topScore = ranked[0]?.score ?? 0;
    let text = "";
    let links: AssistantLink[] = [];
    let suggestions: string[] = [];
    let facts: AssistantFact[] = [];
    let cards: AssistantResourceCard[] = [];
    let responseContext: AssistantDocument | undefined;

    if (intent === "greeting") {
        text = paragraph(
            "Hola. Soy el asistente técnico de ISOCAL.",
            bulletList([
                "Puedo ayudarte con productos, servicios, calibración, herramientas, cotización, blog y contacto.",
                "Solo respondo con información realmente publicada por ISOCAL.",
            ]),
        );
        cards = cardsFromDocuments([
            knowledge.documents.find((document) => document.id === "search-tool"),
            knowledge.documents.find((document) => document.id === "service-advisor"),
            knowledge.documents.find((document) => document.id === "quotation-process"),
        ], knowledge);
        suggestions = [
            "¿Calibran manómetros?",
            "¿Qué servicio necesito para un manómetro?",
            "¿Qué productos de electricidad tienen?",
            "¿Cómo solicito una cotización?",
            "WhatsApp y contacto",
        ];
    } else if (intent === "help") {
        const serviceOverview = knowledge.documents.find((document) => document.id === "services-overview");
        if (isServiceOverviewQuery(trimmed) && serviceOverview) {
            text = paragraph(
                "ISOCAL organiza su oferta en **metrología**, **consultoría y capacitación**, **auditoría** y **equipos e insumos**.",
                bulletList([
                    serviceOverview.body,
                    "Si me dices el equipo, la norma o la necesidad, puedo llevarte al contenido publicado más relevante.",
                ]),
            );
            links = [{ label: "Ver servicios", href: "/servicios", kind: "primary" }, { label: "Orientador técnico", href: "/herramientas#orientador", kind: "secondary" }];
            cards = cardsFromDocuments([serviceOverview, knowledge.documents.find((document) => document.id === "service-advisor")], knowledge, 2);
            suggestions = ["¿Calibran manómetros?", "¿Qué normas ISO trabajan?", "¿Qué productos tienen?"];
            responseContext = serviceOverview;
        } else {
            text = paragraph(
                "Puedo cruzar el catálogo con las capacidades técnicas de ISOCAL.",
                bulletList([
                    "Puedes escribir el nombre de un equipo, una magnitud, una marca, una norma ISO o preguntar cómo cotizar.",
                    "También puedo orientarte hacia herramientas, artículos, contacto o páginas específicas del sitio.",
                    "Si no encuentro respaldo en el contenido publicado, te lo diré en lugar de inventarlo.",
                ]),
            );
            links = [{ label: "Buscador técnico", href: "/buscar", kind: "primary" }, { label: "Orientador técnico", href: "/herramientas#orientador", kind: "secondary" }];
            cards = cardsFromDocuments([
                knowledge.documents.find((document) => document.id === "search-tool"),
                knowledge.documents.find((document) => document.id === "service-advisor"),
                knowledge.documents.find((document) => document.id === "quotation-process"),
            ], knowledge);
            suggestions = ["Busco un multímetro", "Necesito calibrar una balanza", "¿Tienen auditoría ISO 17025?"];
        }
    } else if (intent === "contact") {
        text = paragraph(
            "Claro. Estos son los datos de contacto publicados por ISOCAL.",
            bulletList([
                `WhatsApp: **${COMPANY.whatsappPhone}**.`,
                `Correo comercial: **${COMPANY.salesEmail}**.`,
                `Ubicación: **${COMPANY.location}** · RUC: **${COMPANY.ruc}**.`,
            ]),
        );
        links = [{ label: "Página de contacto", href: "/contacto", kind: "primary" }];
        facts = contactFacts([
            { label: "WhatsApp", value: COMPANY.whatsappPhone, icon: "phone" },
            { label: "Ventas", value: COMPANY.salesEmail, icon: "mail" },
            { label: "Ubicación", value: COMPANY.location, icon: "pin" },
        ]);
        cards = cardsFromDocuments([knowledge.documents.find((document) => document.id === "company-contact")], knowledge, 1);
        suggestions = ["¿Cómo solicito una cotización?", "¿Qué servicios de metrología tienen?", "Abrir contacto", "WhatsApp y contacto"];
        responseContext = knowledge.documents.find((document) => document.id === "company-contact");
    } else if (intent === "company") {
        const sectorQuery = /\bsector\b/.test(normalizeAssistantText(trimmed));
        const companyCandidates = ranked.filter((item) => item.document.kind === "company" && item.score >= 8 && hasSpecificEvidence(trimmed, item.document));
        const company = companyCandidates[0]?.document ?? knowledge.documents.find((document) => document.id === "company-overview");
        if (sectorQuery) {
            const sectors = knowledge.documents.filter((document) => document.id.startsWith("sector-"));
            text = paragraph(
                `ISOCAL publica atención para **${sectors.map((sector) => sector.title).join(", ")}**.`,
                bulletList(sectors.map((sector) => `${sector.title}: ${sector.body}`)),
            );
            cards = cardsFromDocuments(sectors.slice(0, 3), knowledge, 3);
            responseContext = sectors[0] ?? company;
        } else {
            text = paragraph(
                company?.body ?? `${COMPANY.legalName} es ISOCAL.`,
                bulletList([
                    "Si quieres, también puedo mostrarte su respaldo técnico, sectores atendidos o servicios principales.",
                ]),
            );
            cards = cardsFromDocuments([
                company,
                knowledge.documents.find((document) => document.id === "company-accreditation"),
                knowledge.documents.find((document) => document.id === "services-overview"),
            ], knowledge);
            responseContext = company;
        }
        links = [{ label: "Conocer ISOCAL", href: "/nosotros", kind: "primary" }];
        suggestions = ["¿Qué acreditaciones tienen?", "¿Qué servicios ofrecen?"];
    } else if (intent === "accreditation") {
        const accreditation = knowledge.documents.find((document) => document.id === "company-accreditation");
        text = paragraph(
            accreditation?.body ?? "La información de acreditación está disponible en la sección Nosotros.",
            bulletList([
                "Si necesitas confirmar un alcance acreditado específico, conviene validarlo con el equipo técnico.",
            ]),
        );
        links = [{ label: "Ver respaldo y red", href: "/nosotros", kind: "primary" }, { label: "Ver metrología", href: "/servicios#metrologia", kind: "secondary" }];
        facts = [{ label: "Respaldo publicado", value: "Red de laboratorios acreditados y servicios respaldados bajo ISO/IEC 17025", icon: "shield" }];
        cards = cardsFromDocuments([accreditation, knowledge.documents.find((document) => document.id === "company-network")], knowledge, 2);
        suggestions = ["¿Calibran termómetros?", "¿Tienen consultoría ISO 17025?"];
        responseContext = accreditation;
    } else if (intent === "standards") {
        const response = standardResponse(trimmed, ranked, knowledge);
        ({ text, links } = response); cards = response.cards ?? []; responseContext = response.context;
        suggestions = ["¿Tienen consultoría para esa norma?", "¿Hacen auditorías?", "¿Dan capacitaciones?", "Contactar a ISOCAL"];
    } else if (intent === "product") {
        const response = productResponse(ranked, trimmed, knowledge, contextDocument);
        ({ text, links } = response); cards = response.cards ?? []; responseContext = response.context;
        suggestions = ["¿Cómo cotizo este producto?", "¿Hay un servicio de calibración relacionado?", "Ver catálogo completo", "Productos similares"];
    } else if (intent === "calibration") {
        const response = calibrationResponse(ranked, trimmed, knowledge, contextDocument);
        ({ text, links } = response); cards = response.cards ?? []; responseContext = response.context;
        suggestions = ["¿Qué rango debo indicar?", "¿Cómo solicito el servicio?", "Ver orientador técnico", "Contactar a metrología"];
    } else if (["maintenance", "consulting", "training", "audit"].includes(intent)) {
        const serviceIntent = intent as "maintenance" | "consulting" | "training" | "audit";
        const response = genericServiceResponse(serviceIntent, ranked, trimmed, knowledge);
        ({ text, links } = response); cards = response.cards ?? []; responseContext = response.context;
        suggestions = serviceIntent === "consulting" || serviceIntent === "training"
            ? ["¿Trabajan ISO 17025?", "¿Qué capacitaciones tienen?", "Contactar a ISOCAL", "Ver servicios"]
            : ["¿Qué alcance tiene?", "Solicitar información", "Ver servicios", "¿Cómo cotizo?"];
    } else if (intent === "quotation") {
        const product = contextDocument?.kind === "product"
            ? contextDocument
            : ranked.find((item) => item.document.kind === "product" && item.score >= 10 && hasSpecificEvidence(trimmed, item.document))?.document;
        const quotationHasConcreteEntity = concreteEntityTerms(trimmed).length > 0;
        const service = ranked.find((item) =>
            SERVICE_KINDS.has(item.document.kind)
            && item.score >= 10
            && (!isCalibrationDocument(item.document) || !quotationHasConcreteEntity || item.document.kind === "service-item")
            && hasSpecificEvidence(trimmed, item.document),
        )?.document;
        const hasSpecificRequest = specificQueryTokens(trimmed).length > 0;
        if (!product && !service && hasSpecificRequest) {
            text = knowledge.sources.products
                ? paragraph(
                    "No encuentro ese producto o servicio específico dentro del catálogo y las capacidades publicadas de ISOCAL.",
                    bulletList([
                        "Para no dar por disponible algo que no figura en el sistema, no puedo confirmarte una cotización para ese requerimiento desde el asistente.",
                        "Si deseas, puedes explorar el catálogo o consultarlo directamente con ventas.",
                    ]),
                )
                : paragraph(
                    "No encuentro una capacidad técnica publicada que respalde ese requerimiento y, además, el catálogo dinámico no pudo sincronizarse en este momento.",
                    bulletList([
                        "No puedo confirmar ni descartar el producto mientras esa fuente esté indisponible.",
                        "Puedes consultarlo directamente con ventas o revisar más tarde el catálogo.",
                    ]),
                );
            links = [{ label: "Consultar a ISOCAL", href: "/contacto", kind: "primary" }, { label: "Explorar catálogo", href: "/productos", kind: "secondary" }];
            cards = cardsFromDocuments([
                knowledge.documents.find((document) => document.id === "company-contact"),
                knowledge.documents.find((document) => document.id === "quotation-process"),
            ], knowledge, 2);
            suggestions = ["Explorar productos", "Ver servicios", "Contactar a ventas", "Abrir contacto"];
        } else if (product) {
            text = paragraph(
                `Para **${product.title}**, el sitio no publica un precio fijo.`,
                bulletList([
                    "Puedes añadirlo a la lista de cotización e indicar cantidad, modelo, rango u observaciones.",
                    "Luego envías tus datos y recibes por correo un PDF con el requerimiento sin precios.",
                    "Ventas recibe una copia para preparar la propuesta.",
                ]),
            );
            links = uniqueLinks([...(product.href ? [{ label: product.title, href: product.href, kind: "secondary" as const }] : []), { label: "Ir a cotización", href: "/cotizacion", kind: "primary" }]);
            cards = cardsFromDocuments([
                product,
                knowledge.documents.find((document) => document.id === "quotation-process"),
            ], knowledge, 2);
            suggestions = ["¿Qué datos debo indicar?", "Explorar productos", "Contactar a ventas", "Ir a cotización"];
            responseContext = product;
        } else if (service) {
            text = paragraph(
                `Sí encuentro el requerimiento relacionado con **${service.title}** dentro de las capacidades publicadas.`,
                bulletList([
                    "El sitio no publica una tarifa fija para este servicio.",
                    "Puedes enviar una solicitud describiendo equipo, rango, cantidad y observaciones.",
                    "El sistema genera el requerimiento en PDF sin precios para que ventas prepare la propuesta.",
                ]),
            );
            links = uniqueLinks([...(service.href ? [{ label: "Ver servicio relacionado", href: service.href, kind: "secondary" as const }] : []), { label: "Ir a cotización", href: "/cotizacion", kind: "primary" }]);
            cards = cardsFromDocuments([
                service,
                knowledge.documents.find((document) => document.id === "quotation-process"),
            ], knowledge, 2);
            suggestions = ["¿Qué datos debo indicar?", "Ver servicio", "Contactar a ventas", "Ir a cotización"];
            responseContext = service;
        } else {
            text = paragraph(
                "Puedes solicitar una cotización con productos seleccionados o enviar una solicitud de servicio sin productos.",
                bulletList([
                    "Completa tus datos y describe el requerimiento.",
                    "El sistema envía por correo un PDF del requerimiento sin precios.",
                    "Ventas recibe una copia para preparar la propuesta.",
                ]),
            );
            links = [{ label: "Ir a cotización", href: "/cotizacion", kind: "primary" }];
            cards = cardsFromDocuments([knowledge.documents.find((document) => document.id === "quotation-process")], knowledge, 1);
            suggestions = ["¿Qué datos debo indicar?", "Explorar productos", "Contactar a ventas", "Ir a cotización"];
            responseContext = knowledge.documents.find((document) => document.id === "quotation-process");
        }
    } else if (intent === "favorites") {
        text = paragraph(
            "Puedes guardar productos como favoritos desde el catálogo y revisarlos después en la sección Favoritos.",
            bulletList([
                "Es una lista de consulta para volver a encontrar productos con rapidez.",
                "Si deseas solicitar precios, debes usar la lista de cotización.",
            ]),
        );
        links = [{ label: "Ver favoritos", href: "/favoritos", kind: "primary" }, { label: "Explorar catálogo", href: "/productos", kind: "secondary" }];
        cards = cardsFromDocuments([
            knowledge.documents.find((document) => document.id === "favorites-process"),
            knowledge.documents.find((document) => document.id === "quotation-process"),
        ], knowledge, 2);
        suggestions = ["¿Cómo cotizo un producto?", "Ver catálogo", "Agregar a cotización", "Abrir favoritos"];
        responseContext = knowledge.documents.find((document) => document.id === "favorites-process");
    } else if (intent === "conversion") {
        const conversion = extractConversion(trimmed);
        if (conversion?.error === "below-absolute-zero") {
            text = paragraph(
                `No puedo convertir **${formatNumber(conversion.value)} ${conversion.from.symbol}** como una temperatura física válida porque está por debajo del cero absoluto.`,
                bulletList([
                    "El asistente aplica la misma validación del conversor metrológico del sitio.",
                ]),
            );
            links = [{ label: "Abrir conversores", href: "/herramientas#conversores", kind: "primary" }];
            suggestions = ["Convierte -40 °C a °F", "Convierte 25 °C a K", "Convierte 100 PSI a bar", "Abrir conversores"];
        } else if (conversion?.result !== null && conversion?.result !== undefined) {
            text = paragraph(
                `**${formatNumber(conversion.value)} ${conversion.from.symbol} = ${formatNumber(conversion.result)} ${conversion.to.symbol}**`,
                bulletList([
                    "El resultado usa el mismo conversor metrológico disponible en la web de ISOCAL.",
                ]),
            );
            links = [{ label: "Abrir conversores", href: "/herramientas#conversores", kind: "primary" }];
            suggestions = ["Convertir otra unidad", "Usar orientador técnico", "Convierte 100 PSI a bar", "Convierte 25 °C a °F"];
        } else {
            text = paragraph(
                "ISOCAL tiene conversores para presión, temperatura, masa y longitud.",
                bulletList([
                    "Puedes escribir, por ejemplo, “convierte 100 PSI a bar”.",
                    "También puedes abrir la herramienta y elegir manualmente las unidades.",
                ]),
            );
            links = [{ label: "Abrir conversores", href: "/herramientas#conversores", kind: "primary" }];
            suggestions = ["Convierte 100 PSI a bar", "Convierte 25 °C a °F", "Convierte 10 kg a lb", "Abrir conversores"];
        }
        cards = cardsFromDocuments([knowledge.documents.find((document) => document.id === "converter-pressure"), knowledge.documents.find((document) => document.id === "service-advisor")], knowledge, 2);
        responseContext = ranked.find((item) => item.document.kind === "tool")?.document;
    } else if (intent === "tools") {
        text = paragraph(
            "La web incluye varias herramientas técnicas para orientarte sin salir del sitio.",
            bulletList([
                "**Orientador técnico:** ubica el servicio según equipo, magnitud y rango.",
                "**Conversores metrológicos:** presión, temperatura, masa y longitud.",
                "**Buscador técnico universal:** cruza productos y capacidades.",
            ]),
        );
        links = [{ label: "Ver herramientas", href: "/herramientas", kind: "primary" }, { label: "Buscador técnico", href: "/buscar", kind: "secondary" }];
        cards = cardsFromDocuments([
            knowledge.documents.find((document) => document.id === "service-advisor"),
            knowledge.documents.find((document) => document.id === "search-tool"),
            ranked.find((item) => item.document.id.startsWith("converter-"))?.document ?? knowledge.documents.find((document) => document.id === "converter-pressure"),
        ], knowledge, 3);
        suggestions = ["¿Qué servicio necesito para un manómetro?", "Convierte 100 PSI a bar", "Abrir orientador técnico", "Buscador técnico"];
    } else if (intent === "blog") {
        const articles = ranked.filter((item) => item.document.kind === "article" && item.score >= 16).slice(0, 3);
        if (articles.length) {
            text = paragraph(
                `Encontré ${articles.length === 1 ? "un artículo relacionado" : "artículos relacionados"}.`,
                bulletList(articles.map((item) => `**${item.document.title}**.`)),
            );
            links = documentLinks(articles, 3);
            cards = cardsFromDocuments(articles.map((item) => item.document), knowledge, 3);
            responseContext = articles[0]?.document;
        } else {
            text = knowledge.sources.articles
                ? paragraph(
                    "No encuentro un artículo publicado que coincida suficientemente con esa consulta.",
                    bulletList([
                        "Puedes revisar el blog completo.",
                        "No voy a inventar contenido que no esté publicado.",
                    ]),
                )
                : paragraph(
                    "En este momento no pude sincronizar los artículos del blog.",
                    bulletList([
                        "No voy a afirmar que un tema no está publicado cuando la fuente dinámica no respondió.",
                        "Puedes abrir el blog para revisarlo directamente.",
                    ]),
                );
            links = [{ label: "Ver blog", href: "/blog", kind: "primary" }];
            cards = cardsFromDocuments([knowledge.documents.find((document) => document.id === "page-Blog")], knowledge, 1);
        }
        suggestions = ["Ver blog", "Buscar un tema técnico", "¿Qué servicios ofrecen?", "¿Calibran termómetros?"];
    } else if (intent === "navigation") {
        const page = ranked.find((item) => item.document.kind === "page" && item.score >= 14)?.document;
        if (page?.href) {
            text = paragraph(
                `La sección que mejor coincide es **${page.title}**.`,
                bulletList([
                    "Puedo llevarte directamente allí.",
                ]),
            );
            links = [{ label: `Ir a ${page.title}`, href: page.href, kind: "primary" }];
            cards = cardsFromDocuments([page], knowledge, 1);
            responseContext = page;
        } else {
            text = paragraph(
                "Puedo ayudarte a llegar a Productos, Servicios, Herramientas, Blog, Favoritos, Cotización, Nosotros o Contacto.",
                bulletList([
                    "Dime qué necesitas encontrar y te llevo a la sección correcta.",
                ]),
            );
            cards = cardsFromDocuments(knowledge.documents.filter((document) => document.kind === "page").slice(0, 3), knowledge, 3);
            suggestions = ["Ir a productos", "Ir a servicios", "Ir a contacto", "Ir a herramientas"];
        }
    } else {
        const strongest = ranked[0];
        if (strongest && strongest.score >= 20) {
            text = paragraph(
                `Encontré una coincidencia dentro del contenido de ISOCAL: **${strongest.document.title}**.`,
                bulletList([
                    strongest.document.body,
                ]),
            );
            links = strongest.document.href ? [{ label: `Ver ${strongest.document.title}`, href: strongest.document.href, kind: "primary" }] : [];
            cards = cardsFromDocuments([strongest.document], knowledge, 1);
            responseContext = strongest.document;
        } else {
            text = paragraph(
                "No encuentro respaldo suficiente en la información publicada de ISOCAL para responder eso.",
                bulletList([
                    "Solo puedo orientarte sobre contenido que realmente existe en el sistema, así que prefiero no inventar una respuesta.",
                    "Puedes preguntarme por productos, calibraciones, mantenimiento, normas ISO, auditoría, capacitación, herramientas, cotización, blog o contacto.",
                ]),
            );
            links = [{ label: "Buscador técnico", href: "/buscar", kind: "primary" }, { label: "Contactar a ISOCAL", href: "/contacto", kind: "secondary" }];
            cards = cardsFromDocuments([
                knowledge.documents.find((document) => document.id === "search-tool"),
                knowledge.documents.find((document) => document.id === "company-contact"),
            ], knowledge, 2);
            suggestions = ["¿Qué productos tienen?", "¿Calibran termómetros?", "¿Cómo cotizo?", "WhatsApp y contacto", "Ver servicios"];
        }
    }

    const effectiveScore = responseContext ? ranked.find((item) => item.document.id === responseContext.id)?.score ?? topScore : topScore;
    return {
        text,
        intent,
        confidence: Math.max(intent === "unknown" && !responseContext ? 45 : 68, confidenceFrom(effectiveScore, classified.score)),
        links: uniqueLinks(links),
        suggestions: suggestions.slice(0, 5),
        facts,
        cards,
        contextDocumentId: responseContext?.id,
    };
}

export {classifyAssistantIntent} from "./assistantIntent";
export {rankAssistantDocuments} from "./assistantSearch";
