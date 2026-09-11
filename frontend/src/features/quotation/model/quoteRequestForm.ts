import type { PublicProduct } from "../../products/types/product.types";
import type {
    CreateQuoteRequestPayload,
    QuoteRequestFormValues,
    QuoteRequestItemFormValue,
} from "../types/quoteRequest.types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9]{7,20}$/;
const RUC_PATTERN = /^[0-9]{11}$/;

function optionalValue(value: string): string | undefined {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
}

function normalizePhoneForValidation(value: string): string {
    return value.trim().replace(/[\s().-]/g, "");
}

function normalizeRucForValidation(value: string): string {
    return value.trim().replace(/[\s-]/g, "");
}

export function createInitialQuoteRequestForm(
    products: readonly PublicProduct[],
): QuoteRequestFormValues {
    return {
        fullName: "",
        email: "",
        phone: "",
        companyName: "",
        ruc: "",
        jobTitle: "",
        location: "",
        notes: "",
        items: products.map((product) => ({
            productId: product.id,
            quantity: "1",
            notes: "",
        })),
    };
}

export function reconcileQuoteRequestItems(
    currentItems: readonly QuoteRequestItemFormValue[],
    products: readonly PublicProduct[],
): QuoteRequestItemFormValue[] {
    const currentByProductId = new Map(
        currentItems.map((item) => [item.productId, item]),
    );

    return products.map(
        (product) =>
            currentByProductId.get(product.id) ?? {
                productId: product.id,
                quantity: "1",
                notes: "",
            },
    );
}

export function validateQuoteRequestForm(
    form: QuoteRequestFormValues,
): string | null {
    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const phone = normalizePhoneForValidation(form.phone);

    if (!fullName) return "Ingresa tu nombre completo.";
    if (fullName.length > 120) {
        return "El nombre completo no puede superar los 120 caracteres.";
    }
    if (!email) return "Ingresa tu correo electrónico.";
    if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
        return "Ingresa un correo electrónico válido.";
    }
    if (!phone) return "Ingresa un número de teléfono o WhatsApp.";
    if (!PHONE_PATTERN.test(phone)) {
        return "Ingresa un teléfono válido de entre 7 y 20 dígitos.";
    }
    if (form.companyName.trim().length > 160) {
        return "La empresa no puede superar los 160 caracteres.";
    }

    const ruc = normalizeRucForValidation(form.ruc);
    if (ruc && !RUC_PATTERN.test(ruc)) return "El RUC debe contener 11 dígitos.";
    if (form.jobTitle.trim().length > 120) {
        return "El cargo no puede superar los 120 caracteres.";
    }
    if (form.location.trim().length > 120) {
        return "La ciudad o distrito no puede superar los 120 caracteres.";
    }
    if (form.notes.trim().length > 1500) {
        return "Las observaciones generales no pueden superar los 1500 caracteres.";
    }
    if (form.items.length === 0) {
        return "Debes incluir al menos un producto en la solicitud.";
    }

    for (const [index, item] of form.items.entries()) {
        const quantity = Number(item.quantity);
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
            return `La cantidad del producto ${index + 1} debe ser un entero entre 1 y 999.`;
        }
        if (item.notes.trim().length > 500) {
            return `La observación del producto ${index + 1} no puede superar los 500 caracteres.`;
        }
    }

    return null;
}

export function toCreateQuoteRequestPayload(
    form: QuoteRequestFormValues,
): CreateQuoteRequestPayload {
    return {
        customer: {
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            companyName: optionalValue(form.companyName),
            ruc: optionalValue(form.ruc),
            jobTitle: optionalValue(form.jobTitle),
            location: optionalValue(form.location),
            notes: optionalValue(form.notes),
        },
        items: form.items.map((item) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            notes: optionalValue(item.notes),
        })),
    };
}
