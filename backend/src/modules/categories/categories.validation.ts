import { AppError } from "../../shared/errors/AppError.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "./categories.types.js";
const allowedFields = new Set(["name", "slug", "description", "isActive"]);
const slugPattern = /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/;
function fail(message: string, details?: unknown): never {
    throw new AppError(400, message, "VALIDATION_ERROR", details);
}
function asObject(value: unknown): Record<string, unknown> {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        fail("El cuerpo de la solicitud debe ser un objeto JSON.");
    }
    return value as Record<string, unknown>;
}
function validateAllowedFields(body: Record<string, unknown>): void {
    const unknownFields = Object.keys(body).filter((field) => !allowedFields.has(field));
    if (unknownFields.length > 0) {
        fail("La solicitud contiene campos no permitidos.", { fields: unknownFields });
    }
}
function validateName(value: unknown): asserts value is string {
    if (typeof value !== "string" || value.trim().length === 0) {
        fail("name es obligatorio y debe ser texto.");
    }
    if (value.trim().length > 100) {
        fail("name no puede superar los 100 caracteres.");
    }
}
function validateSlug(value: unknown): asserts value is string {
    if (typeof value !== "string" || value.trim().length === 0) {
        fail("slug es obligatorio y debe ser texto.");
    }
    const slug = value.trim();
    if (slug.length > 120) {
        fail("slug no puede superar los 120 caracteres.");
    }
    if (!slugPattern.test(slug)) {
        fail("slug solo puede contener letras, números y guiones simples.");
    }
}
function validateOptionalFields(body: Record<string, unknown>): void {
    if (body.description !== undefined &&
        body.description !== null &&
        typeof body.description !== "string") {
        fail("description debe ser texto o null.");
    }
    if (body.isActive !== undefined && typeof body.isActive !== "boolean") {
        fail("isActive debe ser booleano.");
    }
}
export function validateCreateCategoryBody(value: unknown): asserts value is CreateCategoryInput {
    const body = asObject(value);
    validateAllowedFields(body);
    validateName(body.name);
    validateSlug(body.slug);
    validateOptionalFields(body);
}
export function validateUpdateCategoryBody(value: unknown): asserts value is UpdateCategoryInput {
    const body = asObject(value);
    validateAllowedFields(body);
    if (body.name !== undefined)
        validateName(body.name);
    if (body.slug !== undefined)
        validateSlug(body.slug);
    validateOptionalFields(body);
}
