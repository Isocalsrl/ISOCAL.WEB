import { CONVERTERS, validateAndConvertUnit, type ConverterKind } from "../../technical-tools/model/unitConversion";
import { normalizeAssistantText } from "./assistantText";

interface UnitAlias { alias: string; kind: ConverterKind; unitId: string; symbol: string; }

const UNIT_ALIASES: readonly UnitAlias[] = CONVERTERS.flatMap((converter) => converter.units.flatMap((unit) => {
    const aliases = new Set([unit.id, unit.label, unit.symbol]);
    if (unit.id === "c") ["celsius", "centigrados", "°c"].forEach((alias) => aliases.add(alias));
    if (unit.id === "f") ["fahrenheit", "°f"].forEach((alias) => aliases.add(alias));
    if (unit.id === "k") aliases.add("kelvin");
    if (unit.id === "in") ["pulgada", "pulgadas"].forEach((alias) => aliases.add(alias));
    if (unit.id === "ft") ["pie", "pies"].forEach((alias) => aliases.add(alias));
    if (unit.id === "lb") ["libra", "libras"].forEach((alias) => aliases.add(alias));
    return [...aliases].map((alias) => ({ alias: normalizeAssistantText(alias), kind: converter.id, unitId: unit.id, symbol: unit.symbol }));
})).sort((left, right) => right.alias.length - left.alias.length);

export function extractConversion(query: string): { value: number; from: UnitAlias; to: UnitAlias; result: number | null; error?: "invalid-value" | "below-absolute-zero" } | null {
    const normalized = normalizeAssistantText(query).replace(/,/g, ".");
    const numberMatch = normalized.match(/-?\d+(?:\.\d+)?/);
    if (!numberMatch) return null;
    const value = Number(numberMatch[0]);
    if (!Number.isFinite(value)) return null;
    const numberIndex = numberMatch.index ?? 0;
    const afterNumber = normalized.slice(numberIndex + numberMatch[0].length).trim();
    const foundByUnit = new Map<string, { unit: UnitAlias; index: number }>();
    for (const unit of UNIT_ALIASES) {
        const escaped = unit.alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const match = new RegExp(`(^|\\s)${escaped}(?=\\s|$)`).exec(afterNumber);
        if (!match) continue;
        const key = `${unit.kind}:${unit.unitId}`;
        const index = match.index + (match[1]?.length ?? 0);
        const previous = foundByUnit.get(key);
        if (!previous || index < previous.index) foundByUnit.set(key, { unit, index });
    }
    const found = [...foundByUnit.values()].sort((left, right) => left.index - right.index).map((entry) => entry.unit);
    if (found.length < 2) return null;
    const from = found[0];
    const to = found.find((candidate) => candidate.kind === from.kind && candidate.unitId !== from.unitId);
    if (!to) return null;
    const conversion = validateAndConvertUnit(from.kind, value, from.unitId, to.unitId);
    if (conversion.value === null) return { value, from, to, result: null, error: conversion.error };
    return { value, from, to, result: conversion.value };
}

export function formatNumber(value: number): string {
    return new Intl.NumberFormat("es-PE", { maximumFractionDigits: 6 }).format(value);
}
