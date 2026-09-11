import { AppError } from "../../../shared/errors/AppError.js";
import type { CreateQuoteInput } from "../quotes.types.js";

const ROOT_FIELDS = new Set(["customer", "items"]);
const CUSTOMER_FIELDS = new Set([
    "fullName",
    "email",
    "phone",
    "companyName",
    "ruc",
    "jobTitle",
    "location",
    "notes",
]);
const ITEM_FIELDS = new Set(["productId", "quantity", "notes"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9]{7,20}$/;
const RUC_PATTERN = /^[0-9]{11}$/;
const MAX_QUOTE_ITEMS = 50;

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validationError(message: string, details?: unknown): never {
    throw new AppError(400, message, "VALIDATION_ERROR", details);
}

function assertAllowedFields(
    value: Record<string, unknown>,
    allowedFields: ReadonlySet<string>,
    scope: string,
): void {
    const unknownFields = Object.keys(value).filter(
        (field) => !allowedFields.has(field),
    );

    if (unknownFields.length > 0) {
        validationError(`La sección ${scope} contiene campos no permitidos.`, {
            fields: unknownFields,
        });
    }
}

function assertRequiredText(
    value: unknown,
    field: string,
    maxLength: number,
): asserts value is string {
    if (typeof value !== "string") {
        validationError(`${field} debe ser una cadena de texto.`);
    }

    const normalized = value.trim();
    if (normalized.length === 0) validationError(`${field} es obligatorio.`);
    if (normalized.length > maxLength) {
        validationError(`${field} no puede superar los ${maxLength} caracteres.`);
    }
}

function assertOptionalText(
    value: unknown,
    field: string,
    maxLength: number,
): asserts value is string | null | undefined {
    if (value === undefined || value === null) return;
    if (typeof value !== "string") {
        validationError(`${field} debe ser texto o null.`);
    }
    if (value.trim().length > maxLength) {
        validationError(`${field} no puede superar los ${maxLength} caracteres.`);
    }
}

function normalizePhoneForValidation(value: string): string {
    return value.trim().replace(/[\s().-]/g, "");
}

function normalizeRucForValidation(value: string): string {
    return value.trim().replace(/[\s-]/g, "");
}

function assertCustomer(
    value: unknown,
): asserts value is CreateQuoteInput["customer"] {
    if (!isPlainObject(value)) validationError("customer debe ser un objeto JSON.");
    assertAllowedFields(value, CUSTOMER_FIELDS, "customer");

    assertRequiredText(value.fullName, "customer.fullName", 120);
    assertRequiredText(value.email, "customer.email", 254);
    if (!EMAIL_PATTERN.test(value.email.trim())) {
        validationError("customer.email debe ser un correo electrónico válido.");
    }

    assertRequiredText(value.phone, "customer.phone", 30);
    if (!PHONE_PATTERN.test(normalizePhoneForValidation(value.phone))) {
        validationError(
            "customer.phone debe contener entre 7 y 20 dígitos y puede incluir un prefijo internacional.",
        );
    }

    assertOptionalText(value.companyName, "customer.companyName", 160);
    assertOptionalText(value.ruc, "customer.ruc", 20);
    if (
        typeof value.ruc === "string" &&
        value.ruc.trim().length > 0 &&
        !RUC_PATTERN.test(normalizeRucForValidation(value.ruc))
    ) {
        validationError("customer.ruc debe contener 11 dígitos.");
    }
    assertOptionalText(value.jobTitle, "customer.jobTitle", 120);
    assertOptionalText(value.location, "customer.location", 120);
    assertOptionalText(value.notes, "customer.notes", 1500);
}

function assertItems(
    value: unknown,
): asserts value is CreateQuoteInput["items"] {
    if (!Array.isArray(value)) validationError("items debe ser un arreglo.");
    if (value.length === 0) {
        validationError("Debes incluir al menos un producto en la cotización.");
    }
    if (value.length > MAX_QUOTE_ITEMS) {
        validationError(
            `Una solicitud no puede incluir más de ${MAX_QUOTE_ITEMS} productos.`,
        );
    }

    const productIds = new Set<number>();
    value.forEach((item, index) => {
        if (!isPlainObject(item)) {
            validationError(`items[${index}] debe ser un objeto JSON.`);
        }
        assertAllowedFields(item, ITEM_FIELDS, `items[${index}]`);

        if (!Number.isInteger(item.productId) || (item.productId as number) <= 0) {
            validationError(`items[${index}].productId debe ser un entero positivo.`);
        }
        if (productIds.has(item.productId as number)) {
            validationError("Cada producto debe aparecer una sola vez en la solicitud.");
        }
        productIds.add(item.productId as number);

        if (
            !Number.isInteger(item.quantity) ||
            (item.quantity as number) < 1 ||
            (item.quantity as number) > 999
        ) {
            validationError(
                `items[${index}].quantity debe ser un entero entre 1 y 999.`,
            );
        }
        assertOptionalText(item.notes, `items[${index}].notes`, 500);
    });
}

export function validateCreateQuoteBody(
    value: unknown,
): asserts value is CreateQuoteInput {
    if (!isPlainObject(value)) {
        validationError("El cuerpo de la solicitud debe ser un objeto JSON.");
    }
    assertAllowedFields(value, ROOT_FIELDS, "raíz");
    assertCustomer(value.customer);
    assertItems(value.items);
}
