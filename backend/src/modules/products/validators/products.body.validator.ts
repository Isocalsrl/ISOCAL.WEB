import { AppError } from "../../../shared/errors/AppError.js";
import type {
    CreateProductInput,
    UpdateProductInput,
} from "../products.types.js";

const PRODUCT_FIELDS = new Set([
    "name",
    "slug",
    "description",
    "categoryId",
    "isActive",
]);

const SLUG_PATTERN = /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/;

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validationError(message: string, details?: unknown): never {
    throw new AppError(400, message, "VALIDATION_ERROR", details);
}

function assertAllowedFields(body: Record<string, unknown>): void {
    const unknownFields = Object.keys(body).filter(
        (field) => !PRODUCT_FIELDS.has(field),
    );

    if (unknownFields.length > 0) {
        validationError("La solicitud contiene campos no permitidos.", {
            fields: unknownFields,
        });
    }
}

function assertName(value: unknown): asserts value is string {
    if (typeof value !== "string") {
        validationError("name debe ser una cadena de texto.");
    }

    const name = value.trim();

    if (name.length === 0) {
        validationError("name es obligatorio.");
    }

    if (name.length > 150) {
        validationError("name no puede superar los 150 caracteres.");
    }
}

function assertSlug(value: unknown): asserts value is string {
    if (typeof value !== "string") {
        validationError("slug debe ser una cadena de texto.");
    }

    const slug = value.trim();

    if (slug.length === 0) {
        validationError("slug es obligatorio.");
    }

    if (slug.length > 180) {
        validationError("slug no puede superar los 180 caracteres.");
    }

    if (!SLUG_PATTERN.test(slug)) {
        validationError("slug solo puede contener letras, números y guiones simples.");
    }
}

function assertDescription(value: unknown): asserts value is string | null {
    if (value !== null && typeof value !== "string") {
        validationError("description debe ser texto o null.");
    }
}

function assertCategoryId(value: unknown): asserts value is number | null {
    if (value === null) {
        return;
    }

    if (!Number.isInteger(value) || (value as number) <= 0) {
        validationError("categoryId debe ser un entero positivo o null.");
    }
}

function assertIsActive(value: unknown): asserts value is boolean {
    if (typeof value !== "boolean") {
        validationError("isActive debe ser un valor booleano.");
    }
}

function validateOptionalFields(body: Record<string, unknown>): void {
    if (body.description !== undefined) {
        assertDescription(body.description);
    }

    if (body.categoryId !== undefined) {
        assertCategoryId(body.categoryId);
    }

    if (body.isActive !== undefined) {
        assertIsActive(body.isActive);
    }
}

export function validateCreateProductBody(
    value: unknown,
): asserts value is CreateProductInput {
    if (!isPlainObject(value)) {
        validationError("El cuerpo de la solicitud debe ser un objeto JSON.");
    }

    assertAllowedFields(value);

    assertName(value.name);
    assertSlug(value.slug);

    validateOptionalFields(value);
}

export function validateUpdateProductBody(
    value: unknown,
): asserts value is UpdateProductInput {
    if (!isPlainObject(value)) {
        validationError("El cuerpo de la solicitud debe ser un objeto JSON.");
    }

    if (Object.keys(value).length === 0) {
        validationError("Debes enviar al menos un campo para actualizar.");
    }

    assertAllowedFields(value);

    if (value.name !== undefined) {
        assertName(value.name);
    }

    if (value.slug !== undefined) {
        assertSlug(value.slug);
    }

    validateOptionalFields(value);
}
