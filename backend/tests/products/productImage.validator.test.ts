import { describe, expect, it } from "vitest";
import { AppError } from "../../src/shared/errors/AppError.js";
import { MAX_PRODUCT_IMAGE_SIZE_BYTES, validateProductImage } from "../../src/modules/products/products.validation.js";
import type { UploadedProductImage } from "../../src/modules/products/products.types.js";
function image(buffer: Buffer, mimetype: string): UploadedProductImage {
    return { originalname: "product-image.bin", mimetype, size: buffer.length, buffer };
}
describe("validateProductImage", () => {
    it("acepta JPEG, PNG y WEBP válidos", () => {
        expect(validateProductImage(image(Buffer.from([0xff, 0xd8, 0xff]), "image/jpeg")).extension).toBe("jpg");
        expect(validateProductImage(image(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), "image/png")).extension).toBe("png");
        expect(validateProductImage(image(Buffer.from("RIFFxxxxWEBP"), "image/webp")).extension).toBe("webp");
    });
    it("rechaza contenido que no es una imagen permitida", () => {
        expect(() => validateProductImage(image(Buffer.from("not-an-image"), "image/png"))).toThrowError(AppError);
        expect(() => validateProductImage(image(Buffer.from("not-an-image"), "image/png"))).toThrowError(/JPG/);
    });
    it("rechaza MIME que no coincide con la firma", () => {
        try {
            validateProductImage(image(Buffer.from([0xff, 0xd8, 0xff]), "image/png"));
            expect.fail("debe rechazar MIME incorrecto");
        }
        catch (error) {
            expect(error).toMatchObject({ statusCode: 415, code: "PRODUCT_IMAGE_MIME_MISMATCH" });
        }
    });
    it("rechaza imágenes mayores a 5 MB", () => {
        const buffer = Buffer.alloc(MAX_PRODUCT_IMAGE_SIZE_BYTES + 1);
        buffer[0] = 0xff;
        buffer[1] = 0xd8;
        buffer[2] = 0xff;
        expect(() => validateProductImage(image(buffer, "image/jpeg"))).toThrowError(/5 MB/);
    });
});
