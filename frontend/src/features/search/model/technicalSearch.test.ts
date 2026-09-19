import { describe, expect, it } from "vitest";
import { buildTechnicalSearchResults } from "./technicalSearch";

const categories = [{ id: 1, name: "Instrumentación", slug: "instrumentacion", description: null }];
const products = [
    { id: 1, name: "Manómetro digital", slug: "manometro-digital", description: "Instrumento de presión", categoryId: 1, imageUrl: null },
    { id: 2, name: "Psicrómetro portátil", slug: "psicrometro", description: "Medición de humedad", categoryId: 1, imageUrl: null },
];

describe("buildTechnicalSearchResults", () => {
    it("relaciona PSI con presión sin usar coincidencias de subcadena", () => {
        const results = buildTechnicalSearchResults("PSI", products, categories);
        expect(results.some((result) => result.title.includes("Presión"))).toBe(true);
        expect(results.some((result) => result.title.includes("Psicrómetro"))).toBe(false);
    });

    it("prioriza un manómetro real para una búsqueda de manómetro", () => {
        const results = buildTechnicalSearchResults("manómetro", products, categories);
        expect(results[0]?.title).toBe("Manómetro digital");
    });

    it("relaciona balanza con la magnitud de masa", () => {
        const results = buildTechnicalSearchResults("balanza", [], []);
        expect(results.some((result) => result.title.includes("Masa"))).toBe(true);
    });
});
