import { AppError } from "../../shared/errors/AppError.js";
import { detectImageFormat } from "../../shared/storage/imageFormat.js";
import type { CreateProductInput, UpdateProductInput, UploadedProductImage } from "./products.types.js";
export const MAX_PRODUCT_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const allowedFields = new Set([
    "name",
    "slug",
    "description",
    "categoryId",
    "isActive",
]);
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
    if (value.trim().length > 150) {
        fail("name no puede superar los 150 caracteres.");
    }
}
function validateSlug(value: unknown): asserts value is string {
    if (typeof value !== "string" || value.trim().length === 0) {
        fail("slug es obligatorio y debe ser texto.");
    }
    const slug = value.trim();
    if (slug.length > 180) {
        fail("slug no puede superar los 180 caracteres.");
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
    if (body.categoryId !== undefined && body.categoryId !== null) {
        if (!Number.isInteger(body.categoryId) || Number(body.categoryId) <= 0) {
            fail("categoryId debe ser un entero positivo o null.");
        }
    }
    if (body.isActive !== undefined && typeof body.isActive !== "boolean") {
        fail("isActive debe ser booleano.");
    }
}
export function validateCreateProductBody(value: unknown): asserts value is CreateProductInput {
    const body = asObject(value);
    validateAllowedFields(body);
    validateName(body.name);
    validateSlug(body.slug);
    validateOptionalFields(body);
}
export function validateUpdateProductBody(value: unknown): asserts value is UpdateProductInput {
    const body = asObject(value);
    validateAllowedFields(body);
    if (body.name !== undefined)
        validateName(body.name);
    if (body.slug !== undefined)
        validateSlug(body.slug);
    validateOptionalFields(body);
}
export function validateProductImage(image: UploadedProductImage): {
    mimeType: "image/jpeg" | "image/png" | "image/webp";
    extension: "jpg" | "png" | "webp";
} {
    if (image.size <= 0 || image.buffer.length === 0) {
        throw new AppError(400, "La imagen del producto está vacía.", "PRODUCT_IMAGE_EMPTY");
    }
    if (image.size > MAX_PRODUCT_IMAGE_SIZE_BYTES) {
        throw new AppError(413, "La imagen del producto no puede superar los 5 MB.", "PRODUCT_IMAGE_TOO_LARGE");
    }
    const format = detectImageFormat(image.buffer);
    if (!format) {
        throw new AppError(415, "La imagen debe estar en formato JPG, PNG o WEBP.", "UNSUPPORTED_PRODUCT_IMAGE");
    }
    if (image.mimetype !== format.mimeType) {
        throw new AppError(415, "El tipo declarado de la imagen no coincide con su contenido real.", "PRODUCT_IMAGE_MIME_MISMATCH");
    }
    return format;
}
