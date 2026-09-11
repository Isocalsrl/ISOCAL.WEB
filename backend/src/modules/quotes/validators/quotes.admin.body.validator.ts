import { AppError } from "../../../shared/errors/AppError.js";
import type { QuoteCommercialDetailsInput, QuotePricingInput, QuoteRejectionInput } from "../quotes.types.js";

function invalid(message: string): never { throw new AppError(400, message, "VALIDATION_ERROR"); }
function object(value: unknown): asserts value is Record<string, unknown> { if (typeof value !== "object" || value === null || Array.isArray(value)) invalid("El cuerpo debe ser un objeto JSON."); }
function fields(value: Record<string, unknown>, allowed: readonly string[]): void { const unknown = Object.keys(value).filter((key) => !allowed.includes(key)); if (unknown.length) invalid("El cuerpo contiene campos no permitidos."); }
function optionalText(value: unknown, name: string, max: number): void { if (value !== undefined && value !== null && (typeof value !== "string" || value.trim().length > max)) invalid(`${name} no es válido.`); }
function money(value: unknown, name: string): void { if (typeof value !== "number" || !Number.isFinite(value) || value < 0) invalid(`${name} debe ser un importe no negativo.`); }

export function validatePricingBody(value: unknown): asserts value is QuotePricingInput {
    object(value); fields(value, ["items", "discountAmount", "taxRate"]);
    if (!Array.isArray(value.items) || value.items.length === 0) invalid("Debes enviar los precios de los productos.");
    value.items.forEach((item, index) => { object(item); fields(item, ["itemId", "unitPrice", "discountAmount"]); if (!Number.isInteger(item.itemId) || (item.itemId as number) <= 0) invalid(`items[${index}].itemId no es válido.`); money(item.unitPrice, `items[${index}].unitPrice`); if (item.discountAmount !== undefined) money(item.discountAmount, `items[${index}].discountAmount`); });
    if (value.discountAmount !== undefined) money(value.discountAmount, "discountAmount");
    if (value.taxRate !== undefined && (typeof value.taxRate !== "number" || !Number.isFinite(value.taxRate) || value.taxRate < 0 || value.taxRate > 100)) invalid("taxRate debe estar entre 0 y 100.");
}

export function validateCommercialDetailsBody(value: unknown): asserts value is QuoteCommercialDetailsInput {
    object(value); fields(value, ["currency", "validUntil", "paymentTerms", "commercialNotes", "internalNotes"]);
    if (value.currency !== undefined && value.currency !== "PEN") invalid("La moneda enviada no está soportada.");
    optionalText(value.validUntil, "validUntil", 10); optionalText(value.paymentTerms, "paymentTerms", 500); optionalText(value.commercialNotes, "commercialNotes", 1500); optionalText(value.internalNotes, "internalNotes", 1500);
}

export function validateRejectionBody(value: unknown): asserts value is QuoteRejectionInput {
    object(value); fields(value, ["reason"]); optionalText(value.reason, "reason", 1000);
}
