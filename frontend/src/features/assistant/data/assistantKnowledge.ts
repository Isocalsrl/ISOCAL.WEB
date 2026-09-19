import { ABOUT_ACCREDITATION_BODIES, ABOUT_OVERVIEW, ABOUT_SECTORS, ABOUT_SERVICE_PILLARS, INTEGRATED_POLICY_COMMITMENT, INTEGRATED_POLICY_PRINCIPLES, LABORATORY_NETWORK_DESCRIPTION, LABORATORY_PARTNERS } from "../../public-site/data/about";
import { COMPANY } from "../../public-site/data/company";
import { brands, testimonials } from "../../public-site/data/corporate";
import { PUBLIC_NAVIGATION_ITEMS } from "../../public-site/constants/publicNavigation";
import { AUDIT_DESCRIPTION, AUDIT_GROUPS, CALIBRATION_GROUPS, CONSULTING_DESCRIPTION, CONSULTING_STANDARDS, MAINTENANCE_DESCRIPTION, MAINTENANCE_ITEMS, TESTING_ITEMS, TRAINING_GROUPS } from "../../public-site/data/services";
import { CONVERTERS } from "../../technical-tools/model/unitConversion";
import type { BlogSummary } from "../../blog/model/blog.types";
import type { PublicCategory } from "../../categories/types/category.types";
import type { PublicProduct } from "../../products/types/product.types";
import type { AssistantDocument, AssistantKnowledge, AssistantKnowledgeSources } from "../model/assistant.types";

function staticDocuments(): AssistantDocument[] {
    const documents: AssistantDocument[] = [
        {
            id: "company-overview", kind: "company", title: "ISOCAL",
            body: `${COMPANY.legalName}. ${ABOUT_OVERVIEW} Misión: ${COMPANY.mission} Visión: ${COMPANY.vision}`,
            keywords: ["isocal", "empresa", "quienes somos", "mision", "vision", "mineria", "manufactura", "laboratorios"], href: "/nosotros",
        },
        {
            id: "company-contact", kind: "contact", title: "Contacto de ISOCAL",
            body: `Ubicación: ${COMPANY.location}. WhatsApp: ${COMPANY.whatsappPhone}. Correo comercial: ${COMPANY.salesEmail}. RUC: ${COMPANY.ruc}.`,
            keywords: ["contacto", "telefono", "whatsapp", "correo", "email", "ruc", "ubicacion", "direccion", "lima", "ventas", "metrologia"], href: "/contacto",
        },
        {
            id: "company-accreditation", kind: "company", title: "Acreditaciones y respaldo técnico",
            body: `La red metrológica está compuesta por laboratorios acreditados por ${ABOUT_ACCREDITATION_BODIES.join(", ")}. Los servicios de calibración se presentan como respaldados bajo ISO/IEC 17025. ${INTEGRATED_POLICY_COMMITMENT}`,
            keywords: ["acreditacion", "acreditado", "inacal", "a2la", "pjla", "iso", "17025", "calidad", "imparcialidad"], href: "/nosotros",
        },
        {
            id: "company-network", kind: "company", title: "Red de laboratorios",
            body: `${LABORATORY_NETWORK_DESCRIPTION} Integrantes publicados: ${LABORATORY_PARTNERS.map((partner) => partner.name).join(", ")}.`,
            keywords: ["red", "laboratorios", "socios", "partners", ...LABORATORY_PARTNERS.map((partner) => partner.name)], href: "/nosotros",
        },
        {
            id: "company-policy", kind: "company", title: "Política integrada",
            body: `${INTEGRATED_POLICY_COMMITMENT} Principios publicados: ${INTEGRATED_POLICY_PRINCIPLES.map((principle) => `${principle.title}: ${principle.description}`).join(" ")}`,
            keywords: ["politica", "calidad", "imparcialidad", "cumplimiento", "mejora continua", "satisfaccion", "partes interesadas"], href: "/nosotros",
        },
        {
            id: "company-brands", kind: "company", title: "Marcas del portafolio",
            body: `Marcas mostradas en el sitio de ISOCAL: ${brands.join(", ")}. La disponibilidad de un equipo concreto se confirma en el catálogo y mediante cotización.`,
            keywords: ["marca", "marcas", "portafolio", ...brands], href: "/productos",
        },
        {
            id: "company-testimonials", kind: "company", title: "Testimonios publicados",
            body: `El sitio publica testimonios de ${testimonials.map((testimonial) => testimonial.company).join(", ")}.`,
            keywords: ["testimonio", "testimonios", "clientes", "referencias", ...testimonials.map((testimonial) => testimonial.company)], href: "/",
        },
        {
            id: "services-overview", kind: "page", title: "Servicios de ISOCAL",
            body: ABOUT_SERVICE_PILLARS.map((pillar) => `${pillar.title}: ${pillar.description} ${pillar.detail}`).join(" "),
            keywords: ["servicio", "servicios", "metrologia", "consultoria", "capacitacion", "auditoria", "equipos", "insumos"], href: "/servicios",
        },
        {
            id: "quotation-process", kind: "process", title: "Solicitud de cotización",
            body: "La web permite seleccionar productos o solicitar un servicio sin productos, completar datos de contacto y observaciones. Al enviar, el cliente recibe por correo un PDF con el requerimiento sin precios y ventas recibe una copia para preparar la propuesta.",
            keywords: ["cotizacion", "precio", "costo", "presupuesto", "pdf", "requerimiento", "ventas", "cantidad", "observaciones"], href: "/cotizacion",
        },
        {
            id: "favorites-process", kind: "process", title: "Favoritos",
            body: "La sección Favoritos permite guardar productos del catálogo para revisarlos después y abrir nuevamente su detalle.",
            keywords: ["favorito", "guardar", "producto", "lista", "despues"], href: "/favoritos",
        },
        {
            id: "search-tool", kind: "tool", title: "Buscador técnico universal",
            body: "Busca productos, categorías, magnitudes, unidades y capacidades metrológicas desde un solo lugar.",
            keywords: ["buscar", "buscador", "producto", "magnitud", "unidad", "servicio", "encontrar"], href: "/buscar",
        },
        {
            id: "service-advisor", kind: "tool", title: "Orientador técnico",
            body: "Ayuda a elegir una capacidad técnica a partir del equipo, la magnitud, la necesidad de calibración o mantenimiento y, opcionalmente, el rango de trabajo. No reemplaza al asesor ni genera una cotización.",
            keywords: ["orientador", "que servicio necesito", "equipo", "magnitud", "rango", "calibracion", "mantenimiento"], href: "/herramientas#orientador",
        },
    ];

    for (const sector of ABOUT_SECTORS) {
        documents.push({ id: `sector-${sector.number}`, kind: "company", title: sector.title, body: sector.description, keywords: [sector.title, "sector", "industria"], href: "/nosotros" });
    }

    for (const group of CALIBRATION_GROUPS) {
        documents.push({
            id: `calibration-${group.id}`, kind: "service", title: `Calibración · ${group.title}`,
            body: `ISOCAL presenta capacidad de calibración para ${group.title}: ${group.items.join(", ")}.`,
            keywords: ["calibracion", group.title, ...group.items], href: `/servicios#metrologia`, group: group.title,
        });
        for (const item of group.items) {
            documents.push({ id: `calibration-${group.id}-${item}`, kind: "service-item", title: item, body: `Equipo relacionado con la magnitud ${group.title} dentro de los servicios de calibración publicados por ISOCAL.`, keywords: [item, group.title, "calibracion"], href: "/servicios#metrologia", group: group.title });
        }
    }

    documents.push({ id: "maintenance", kind: "service", title: "Mantenimiento", body: `${MAINTENANCE_DESCRIPTION} Equipos atendidos: ${MAINTENANCE_ITEMS.join(", ")}.`, keywords: ["mantenimiento", "diagnostico", "preventivo", "correctivo", ...MAINTENANCE_ITEMS], href: "/servicios#mantenimiento" });
    documents.push({ id: "testing", kind: "service", title: "Ensayos y caracterización", body: `Servicios publicados: ${TESTING_ITEMS.join(", ")}.`, keywords: ["ensayo", "caracterizacion", "mapeo", ...TESTING_ITEMS], href: "/servicios#mantenimiento" });

    documents.push({ id: "consulting", kind: "service", title: "Consultoría", body: `${CONSULTING_DESCRIPTION} Normas: ${CONSULTING_STANDARDS.join(", ")}.`, keywords: ["consultoria", "implementacion", "certificacion", ...CONSULTING_STANDARDS], href: "/servicios#consultoria" });
    for (const group of TRAINING_GROUPS) {
        documents.push({ id: `training-${group.id}`, kind: "service", title: `Capacitación · ${group.title}`, body: group.items.join(". "), keywords: ["capacitacion", "curso", group.title, ...group.items], href: "/servicios#consultoria", group: group.title });
    }

    documents.push({ id: "audit", kind: "service", title: "Auditoría", body: AUDIT_DESCRIPTION, keywords: ["auditoria", "diagnostico", "interna", "sistema gestion"], href: "/servicios#auditoria" });
    for (const group of AUDIT_GROUPS) {
        documents.push({ id: `audit-${group.id}`, kind: "service", title: group.title, body: group.items.join(". "), keywords: ["auditoria", group.title, ...group.items], href: "/servicios#auditoria", group: group.title });
    }

    for (const converter of CONVERTERS) {
        documents.push({ id: `converter-${converter.id}`, kind: "tool", title: `Conversor de ${converter.title}`, body: `${converter.description} Unidades disponibles: ${converter.units.map((unit) => `${unit.label} (${unit.symbol})`).join(", ")}.`, keywords: ["conversion", "convertir", converter.title, ...converter.units.flatMap((unit) => [unit.id, unit.label, unit.symbol])], href: `/herramientas#conversores` });
    }

    for (const item of PUBLIC_NAVIGATION_ITEMS) {
        documents.push({ id: `page-${item.label}`, kind: "page", title: item.label, body: item.children?.map((child) => `${child.label}: ${child.description}`).join(" ") ?? `Página pública ${item.label} de ISOCAL.`, keywords: [item.label, ...(item.children?.map((child) => child.label) ?? [])], href: item.to });
    }

    return documents;
}

export function buildAssistantKnowledge(
    products: readonly PublicProduct[] = [],
    categories: readonly PublicCategory[] = [],
    articles: readonly BlogSummary[] = [],
    sources: AssistantKnowledgeSources = {
        products: products.length > 0,
        categories: categories.length > 0,
        articles: articles.length > 0,
    },
): AssistantKnowledge {
    const categoryById = new Map(categories.map((category) => [category.id, category]));
    const dynamicDocuments: AssistantDocument[] = [];

    for (const category of categories) {
        dynamicDocuments.push({ id: `category-${category.id}`, kind: "category", title: category.name, body: category.description ?? `Categoría ${category.name} del catálogo ISOCAL.`, keywords: [category.name, category.slug, "categoria", "producto"], href: `/productos?categoria=${category.slug}` });
    }

    for (const product of products) {
        const category = product.categoryId ? categoryById.get(product.categoryId) : undefined;
        dynamicDocuments.push({ id: `product-${product.id}`, kind: "product", title: product.name, body: `${product.description ?? "Producto disponible en el catálogo técnico de ISOCAL."}${category ? ` Categoría: ${category.name}.` : ""}`, keywords: [product.name, product.slug, category?.name ?? "", "producto", "catalogo"], href: `/productos/${product.id}`, productId: product.id, group: category?.name });
    }

    for (const article of articles) {
        dynamicDocuments.push({ id: `article-${article.id}`, kind: "article", title: article.title, body: `${article.excerpt} Tema: ${article.topic}. Autor: ${article.authorName}.`, keywords: [article.title, article.topic, article.excerpt, "blog", "articulo"], href: `/blog/${article.slug}` });
    }

    return { documents: [...staticDocuments(), ...dynamicDocuments], products, categories, articles, sources };
}
