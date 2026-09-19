import { describe, expect, it } from "vitest";
import { CALIBRATION_GROUPS } from "../../public-site/data/services/metrology";
import { buildAssistantKnowledge } from "../data/assistantKnowledge";
import { answerAssistantQuery, classifyAssistantIntent, rankAssistantDocuments } from "./assistantEngine";
import type { AssistantConversationContext } from "./assistant.types";

const categories = [
    { id: 1, name: "Electricidad", slug: "electricidad", description: "Equipos e insumos eléctricos." },
    { id: 2, name: "Laboratorio", slug: "laboratorio", description: "Instrumentación de laboratorio." },
    { id: 3, name: "Alquiler de equipos", slug: "alquiler", description: "Equipos disponibles para alquiler." },
];

const products = [
    { id: 1, name: "Multímetro digital Sonel", slug: "multimetro-digital-sonel", description: "Instrumento para medición eléctrica. Modelo, disponibilidad y condiciones sujetos a cotización.", categoryId: 1, imageUrl: null },
    { id: 2, name: "Medidor de pH de mesa Apera", slug: "medidor-de-ph-de-mesa-apera", description: "Instrumentación electroquímica de mesa Apera para laboratorio.", categoryId: 2, imageUrl: null },
    { id: 3, name: "Alquiler de sonómetro", slug: "alquiler-de-sonometro", description: "Sonómetro integrador para medición de ruido y análisis de frecuencia.", categoryId: 3, imageUrl: null },
    { id: 4, name: "Detectores portátiles de gases MSA", slug: "detectores-portatiles-de-gases-msa", description: "Venta y alquiler de detectores portátiles.", categoryId: 1, imageUrl: null },
];

const articles = [
    { id: 1, title: "Cómo entender la calibración de un manómetro", slug: "calibracion-manometro", excerpt: "Conceptos clave para preparar un manómetro antes de solicitar calibración.", topic: "Metrología", authorName: "Equipo ISOCAL", coverUrl: null, coverAlt: "", publishedAt: "2026-09-01", updatedAt: "2026-09-01", readingMinutes: 4 },
];

const knowledge = buildAssistantKnowledge(products, categories, articles);

function ask(query: string, context: AssistantConversationContext = {}) {
    return answerAssistantQuery(query, knowledge, context);
}

describe("assistant intent classifier", () => {
    it.each([
        ["Hola", "greeting"],
        ["¿Cómo los contacto por WhatsApp?", "contact"],
        ["¿Están acreditados bajo ISO 17025?", "accreditation"],
        ["Quiero cotizar", "quotation"],
        ["Necesito calibrar un manómetro", "calibration"],
        ["¿Hacen mantenimiento preventivo?", "maintenance"],
        ["Busco consultoría ISO 9001", "consulting"],
        ["¿Dan capacitaciones?", "training"],
        ["Necesito auditoría interna", "audit"],
        ["¿Qué productos venden?", "product"],
        ["Convierte 100 PSI a bar", "conversion"],
        ["¿Tienen un orientador técnico?", "tools"],
        ["¿Cómo guardo favoritos?", "favorites"],
        ["¿Tienen artículos en el blog?", "blog"],
        ["¿Quiénes son?", "company"],
    ])("clasifica %s", (query, expected) => {
        expect(classifyAssistantIntent(query).intent).toBe(expected);
    });
});

describe("assistant retrieval and answers", () => {
    it("encuentra un producto real y no inventa precio", () => {
        const reply = ask("¿Tienen multímetro Sonel y cuánto cuesta?");
        expect(reply.intent).toBe("product");
        expect(reply.text).toContain("Multímetro digital Sonel");
        expect(reply.text.toLowerCase()).toContain("no publica un precio fijo");
        expect(reply.links.some((link) => link.href === "/productos/1")).toBe(true);
    });

    it("distingue un servicio de calibración de un producto inexistente", () => {
        const reply = ask("¿Venden manómetros?");
        expect(reply.intent).toBe("product");
        expect(reply.text).toContain("No encuentro esa consulta como un producto publicado");
        expect(reply.text).toContain("Presión");
    });

    it("tolera un error de escritura técnico", () => {
        const ranked = rankAssistantDocuments("necesito calibrar un manometor", knowledge);
        expect(ranked.some((item) => item.document.title.toLowerCase().includes("manómetro"))).toBe(true);
        const reply = ask("necesito calibrar un manometor");
        expect(reply.intent).toBe("calibration");
        expect(reply.text).toContain("Presión");
    });

    it("relaciona PSI con presión", () => {
        const reply = ask("Tengo un equipo de 0 a 300 PSI, ¿qué servicio sería?");
        expect(reply.text).toContain("Presión");
        expect(reply.links.some((link) => link.href.includes("orientador"))).toBe(true);
    });

    it("relaciona un producto con un servicio técnico existente", () => {
        const reply = ask("multímetro");
        expect(reply.text).toContain("Multímetro digital Sonel");
        expect(reply.text.toLowerCase()).toContain("calibr");
    });

    it("responde sobre alquiler usando el catálogo", () => {
        const reply = ask("¿Alquilan sonómetros para ruido?");
        expect(reply.text).toContain("Alquiler de sonómetro");
        expect(reply.links.some((link) => link.href === "/productos/3")).toBe(true);
    });

    it("encuentra detectores de gases", () => {
        const reply = ask("Necesito un detector portátil de gas MSA");
        expect(reply.text).toContain("Detectores portátiles de gases MSA");
    });

    it("expone datos de contacto oficiales del sistema", () => {
        const reply = ask("correo y teléfono de ISOCAL");
        expect(reply.text).toContain("ventas@isocal.pe");
        expect(reply.text).toContain("+51 991 769 896");
    });

    it("responde acreditación sin ampliar lo publicado", () => {
        const reply = ask("¿Qué acreditaciones tienen?");
        expect(reply.text).toContain("INACAL");
        expect(reply.text).toContain("A2LA");
        expect(reply.text).toContain("PJLA");
        expect(reply.text).toContain("ISO/IEC 17025");
    });

    it("responde consultoría ISO 9001", () => {
        const reply = ask("¿Me pueden ayudar a implementar ISO 9001?");
        expect(reply.intent).toBe("consulting");
        expect(reply.text).toContain("ISO 9001");
    });

    it("responde capacitación específica", () => {
        const reply = ask("curso de procedimiento de calibración de termómetros");
        expect(reply.intent).toBe("training");
        expect(reply.text).toContain("Termómetros");
    });

    it("responde auditoría interna ISO 17025", () => {
        const reply = ask("¿Hacen auditoría interna ISO 17025?");
        expect(reply.intent).toBe("audit");
        expect(reply.text).toContain("17025");
    });

    it("responde mantenimiento", () => {
        const reply = ask("¿Hacen mantenimiento preventivo de equipos de laboratorio?");
        expect(reply.intent).toBe("maintenance");
        expect(reply.text.toLowerCase()).toContain("mantenimiento");
    });

    it("calcula PSI a bar con el conversor existente", () => {
        const reply = ask("convierte 100 PSI a bar");
        expect(reply.intent).toBe("conversion");
        expect(reply.text).toContain("6,894757 bar");
    });

    it("calcula Celsius a Fahrenheit", () => {
        const reply = ask("convierte 25 °C a °F");
        expect(reply.text).toContain("77 °F");
    });

    it("explica cotización sin prometer precio", () => {
        const reply = ask("¿cómo solicito una cotización?");
        expect(reply.intent).toBe("quotation");
        expect(reply.text).toContain("PDF");
        expect(reply.text).toContain("sin precios");
    });

    it("usa contexto de producto en una pregunta posterior de precio", () => {
        const first = ask("multímetro Sonel");
        const context: AssistantConversationContext = { lastIntent: first.intent, lastDocumentId: first.contextDocumentId, lastProductId: 1 };
        const second = ask("¿y cuánto cuesta ese?", context);
        expect(second.intent).toBe("quotation");
        expect(second.text).toContain("Multímetro digital Sonel");
        expect(second.text).toContain("no publica un precio fijo");
    });

    it("encuentra artículo publicado", () => {
        const reply = ask("¿Tienen un artículo sobre calibración de manómetros?");
        expect(reply.intent).toBe("blog");
        expect(reply.text).toContain("Cómo entender la calibración de un manómetro");
    });

    it("rechaza una consulta ajena sin alucinar", () => {
        const reply = ask("¿Quién ganó el mundial de fútbol y cuál es la capital de Japón?");
        expect(reply.intent).toBe("unknown");
        expect(reply.text).toContain("No encuentro respaldo suficiente");
        expect(reply.confidence).toBeLessThan(70);
    });

    it("no convierte una coincidencia débil en un producto inventado", () => {
        const reply = ask("¿Venden laptops gamer RTX 5090?");
        expect(reply.text.toLowerCase()).not.toContain("sí encuentro **laptop");
        expect(reply.links.some((link) => link.href.includes("productos/") && link.href !== "/productos")).toBe(false);
    });

    it("responde la calibración genérica como panorama y no elige un instrumento arbitrario", () => {
        const reply = ask("¿Tienen servicio de calibración?");
        expect(reply.intent).toBe("calibration");
        expect(reply.text).toContain(`${CALIBRATION_GROUPS.length} áreas técnicas`);
    });

    it("distingue una norma ofrecida de una certificación propia de ISOCAL", () => {
        const reply = ask("¿ISOCAL está certificada ISO 9001?");
        expect(reply.intent).toBe("standards");
        expect(reply.text).toContain("No encuentro");
        expect(reply.text).toContain("certificada");
    });

    it("explica ISO 17025 sin atribuir una acreditación corporativa no publicada", () => {
        const reply = ask("¿ISOCAL está acreditada ISO 17025?");
        expect(reply.intent).toBe("standards");
        expect(reply.text).toContain("no afirma");
        expect(reply.text).toContain("INACAL");
    });

    it.each([
        "¿Pueden calibrar una bicicleta eléctrica?",
        "¿Pueden calibrar un reloj inteligente?",
        "¿Pueden calibrar una cámara fotográfica?",
        "¿Pueden calibrar una cámara digital?",
    ])("rechaza entidades no publicadas aunque compartan palabras de contexto: %s", (query) => {
        const reply = ask(query);
        expect(reply.intent).toBe("calibration");
        expect(reply.text).toContain("No encuentro esa capacidad de calibración");
    });

    it("tolera transposición en nombres largos de instrumentos", () => {
        const reply = ask("Necesito calibrar Calibrdaores Acústicos");
        expect(reply.intent).toBe("calibration");
        expect(reply.text).not.toContain("No encuentro esa capacidad de calibración");
    });

    it("bloquea conversiones de temperatura por debajo del cero absoluto", () => {
        const reply = ask("convierte -300 c a k");
        expect(reply.intent).toBe("conversion");
        expect(reply.text).toContain("cero absoluto");
    });

    it("no interpreta una caída del catálogo como ausencia comercial", () => {
        const unavailable = buildAssistantKnowledge([], [], [], { products: false, categories: false, articles: false });
        const reply = answerAssistantQuery("¿Venden una laptop industrial?", unavailable);
        expect(reply.text).toContain("no pude sincronizar el catálogo dinámico");
        expect(reply.text).toContain("no puedo confirmar ni descartar");
    });
});

describe("assistant calibration stress matrix", () => {
    const allEquipment = CALIBRATION_GROUPS.flatMap((group) => group.items.map((item) => ({ group, item })));

    it(`reconoce ${allEquipment.length * 3} formulaciones de equipos publicados`, () => {
        const templates = [
            (item: string) => `Hola, necesito saber si ISOCAL puede calibrar ${item}; el equipo está en operación y quiero conocer qué área técnica corresponde.`,
            (item: string) => `Tenemos ${item} en planta. ¿Este instrumento figura dentro de sus servicios de calibración? No necesito precio todavía, solo confirmar la capacidad publicada.`,
            (item: string) => `Consulta técnica: para ${item}, ¿existe una magnitud o servicio relacionado en ISOCAL y dónde puedo revisar esa información?`,
        ];
        for (const {item} of allEquipment) {
            for (const template of templates) {
                const reply = ask(template(item));
                expect(reply.intent).toBe("calibration");
                expect(reply.text).not.toContain("No encuentro esa capacidad de calibración");
            }
        }
    });

    it("mantiene fuera de alcance un bloque amplio de consultas no relacionadas", () => {
        const unrelated = [
            "recomiéndame una película de ciencia ficción para esta noche",
            "cuál es el mejor restaurante italiano de Lima",
            "hazme una rutina de gimnasio para ganar masa muscular",
            "quién es el presidente actual de otro país",
            "escribe un poema romántico de veinte versos",
            "cuánto vale bitcoin hoy y si debería comprar",
            "dame el resultado del último partido de fútbol",
            "cómo arreglo la batería de mi celular",
            "qué lenguaje de programación debería aprender",
            "resume la historia del imperio romano",
        ];
        for (const query of unrelated) {
            const reply = ask(query);
            expect(reply.intent).toBe("unknown");
            expect(reply.text).toContain("No encuentro respaldo suficiente");
        }
    });
});
