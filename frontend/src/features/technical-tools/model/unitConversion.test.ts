import { describe, expect, it } from "vitest";
import { convertUnit, validateAndConvertUnit } from "./unitConversion";

describe("unit conversions", () => {
    it("converts PSI to bar with practical precision", () => {
        expect(convertUnit("pressure", 300, "psi", "bar")).toBeCloseTo(20.6842718795, 8);
    });

    it("converts Celsius to Fahrenheit", () => {
        expect(convertUnit("temperature", 100, "c", "f")).toBe(212);
    });

    it("converts kilograms to grams and millimetres to metres", () => {
        expect(convertUnit("mass", 1, "kg", "g")).toBe(1000);
        expect(convertUnit("length", 1, "mm", "m")).toBe(0.001);
    });

    it("preserves identity and rejects values below absolute zero", () => {
        expect(convertUnit("mass", 4.5, "kg", "kg")).toBe(4.5);
        expect(validateAndConvertUnit("temperature", -1, "k", "c")).toEqual({ value: null, error: "below-absolute-zero" });
    });
});
