import type {
    CreateQuoteInput,
    NormalizedCreateQuoteInput,
} from "../quotes.types.js";

function normalizeText(value: string): string {
    return value.trim().replace(/\s+/g, " ");
}

function normalizeNotes(value: string | null | undefined): string | null {
    if (value == null) return null;
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
}

function normalizeOptionalText(
    value: string | null | undefined,
): string | null {
    if (value == null) return null;
    const normalized = normalizeText(value);
    return normalized.length > 0 ? normalized : null;
}

function normalizePhone(value: string): string {
    return value.trim().replace(/[\s().-]/g, "");
}

function normalizeRuc(value: string | null | undefined): string | null {
    if (value == null) return null;
    const normalized = value.trim().replace(/[\s-]/g, "");
    return normalized.length > 0 ? normalized : null;
}

export function normalizeCreateQuoteInput(
    input: CreateQuoteInput,
): NormalizedCreateQuoteInput {
    return {
        customer: {
            fullName: normalizeText(input.customer.fullName),
            email: input.customer.email.trim().toLowerCase(),
            phone: normalizePhone(input.customer.phone),
            companyName: normalizeOptionalText(input.customer.companyName),
            ruc: normalizeRuc(input.customer.ruc),
            jobTitle: normalizeOptionalText(input.customer.jobTitle),
            location: normalizeOptionalText(input.customer.location),
            notes: normalizeNotes(input.customer.notes),
        },
        items: input.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            notes: normalizeNotes(item.notes),
        })),
    };
}
