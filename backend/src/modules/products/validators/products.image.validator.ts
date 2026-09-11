import { AppError } from "../../../shared/errors/AppError.js";
import type { UploadedProductImage } from "../products.types.js";

export const MAX_PRODUCT_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export interface ProductImageFormat {
    mimeType: "image/jpeg" | "image/png" | "image/webp";
    extension: "jpg" | "png" | "webp";
}

function startsWith(buffer: Buffer, bytes: readonly number[]): boolean {
    return buffer.length >= bytes.length && bytes.every((byte, index) => buffer[index] === byte);
}

function detectFormat(buffer: Buffer): ProductImageFormat | null {
    if (startsWith(buffer, [0xff, 0xd8, 0xff])) return { mimeType: "image/jpeg", extension: "jpg" };
    if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
        return { mimeType: "image/png", extension: "png" };
    }
    if (buffer.length >= 12 && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") {
        return { mimeType: "image/webp", extension: "webp" };
    }
    return null;
}

export function validateProductImage(image: UploadedProductImage): ProductImageFormat {
    if (image.size <= 0 || image.buffer.length === 0) {
        throw new AppError(400, "La imagen del producto está vacía.", "PRODUCT_IMAGE_EMPTY");
    }
    if (image.size > MAX_PRODUCT_IMAGE_SIZE_BYTES) {
        throw new AppError(413, "La imagen del producto no puede superar los 5 MB.", "PRODUCT_IMAGE_TOO_LARGE");
    }
    const format = detectFormat(image.buffer);
    if (!format) {
        throw new AppError(415, "La imagen debe estar en formato JPG, PNG o WEBP.", "UNSUPPORTED_PRODUCT_IMAGE");
    }
    if (image.mimetype !== format.mimeType) {
        throw new AppError(415, "El tipo declarado de la imagen no coincide con su contenido real.", "PRODUCT_IMAGE_MIME_MISMATCH");
    }
    return format;
}
