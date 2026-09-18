export type ConverterKind = "pressure" | "temperature" | "mass" | "length";

export interface UnitDefinition {
    id: string;
    label: string;
    symbol: string;
    toBase: (value: number) => number;
    fromBase: (value: number) => number;
}

export interface ConverterDefinition {
    id: ConverterKind;
    title: string;
    description: string;
    units: readonly UnitDefinition[];
}

export interface ConversionResult {
    value: number | null;
    error?: "invalid-value" | "below-absolute-zero";
}

function linearUnit(id: string, label: string, symbol: string, factor: number): UnitDefinition {
    return {
        id,
        label,
        symbol,
        toBase: (value) => value * factor,
        fromBase: (value) => value / factor,
    };
}

export const CONVERTERS: readonly ConverterDefinition[] = [
    {
        id: "pressure",
        title: "Presión",
        description: "Pa, kPa, bar, PSI y atm.",
        units: [
            linearUnit("pa", "Pascal", "Pa", 1),
            linearUnit("kpa", "Kilopascal", "kPa", 1_000),
            linearUnit("mpa", "Megapascal", "MPa", 1_000_000),
            linearUnit("bar", "Bar", "bar", 100_000),
            linearUnit("mbar", "Milibar", "mbar", 100),
            linearUnit("psi", "Libra por pulgada cuadrada", "PSI", 6_894.757293168),
            linearUnit("atm", "Atmósfera", "atm", 101_325),
        ],
    },
    {
        id: "temperature",
        title: "Temperatura",
        description: "Celsius, Fahrenheit y Kelvin.",
        units: [
            { id: "c", label: "Celsius", symbol: "°C", toBase: (v) => v, fromBase: (v) => v },
            { id: "f", label: "Fahrenheit", symbol: "°F", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
            { id: "k", label: "Kelvin", symbol: "K", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
        ],
    },
    {
        id: "mass",
        title: "Masa",
        description: "kg, g, mg, lb y oz.",
        units: [
            linearUnit("kg", "Kilogramo", "kg", 1),
            linearUnit("g", "Gramo", "g", 0.001),
            linearUnit("mg", "Miligramo", "mg", 0.000001),
            linearUnit("t", "Tonelada", "t", 1_000),
            linearUnit("lb", "Libra", "lb", 0.45359237),
            linearUnit("oz", "Onza", "oz", 0.028349523125),
        ],
    },
    {
        id: "length",
        title: "Longitud",
        description: "m, cm, mm, in y ft.",
        units: [
            linearUnit("m", "Metro", "m", 1),
            linearUnit("km", "Kilómetro", "km", 1_000),
            linearUnit("cm", "Centímetro", "cm", 0.01),
            linearUnit("mm", "Milímetro", "mm", 0.001),
            linearUnit("in", "Pulgada", "in", 0.0254),
            linearUnit("ft", "Pie", "ft", 0.3048),
        ],
    },
];

export function convertUnit(kind: ConverterKind, value: number, fromId: string, toId: string): number | null {
    const converter = CONVERTERS.find((item) => item.id === kind);
    const from = converter?.units.find((unit) => unit.id === fromId);
    const to = converter?.units.find((unit) => unit.id === toId);
    if (!from || !to || !Number.isFinite(value)) return null;
    return to.fromBase(from.toBase(value));
}

export function validateAndConvertUnit(kind: ConverterKind, value: number, fromId: string, toId: string): ConversionResult {
    if (!Number.isFinite(value)) return { value: null, error: "invalid-value" };
    const absoluteKelvin = kind === "temperature"
        ? convertUnit("temperature", value, fromId, "k")
        : 0;
    if (absoluteKelvin !== null && absoluteKelvin < 0) return { value: null, error: "below-absolute-zero" };
    const converted = convertUnit(kind, value, fromId, toId);
    return converted === null ? { value: null, error: "invalid-value" } : { value: converted };
}
