import { AppError } from "../../shared/errors/AppError.js";
import { buildStorageKey } from "../../shared/storage/providers/localFileStorage.provider.js";
import { binaryStorage } from "../../shared/storage/storageService.js";
import type { ProductImageAsset, UploadedProductImage } from "./products.types.js";
import { validateProductImage } from "./products.validation.js";
export interface StoredProductImage {
    storageKey: string;
    fileName: string;
    mimeType: string;
    fileSizeBytes: number;
    sha256: string;
}
function safeFileName(originalName: string, fallbackName: string): string {
    const leafName = originalName
        .replace(/\0/g, "")
        .split(/[\\/]/)
        .at(-1)
        ?.trim();
    return (leafName || fallbackName).slice(0, 255);
}
export async function storeProductImage(productId: number, image: UploadedProductImage): Promise<StoredProductImage> {
    const format = validateProductImage(image);
    const storageKey = buildStorageKey({
        resourceType: "products",
        resourceId: productId,
        assetRole: "image",
        extension: format.extension,
    });
    const stored = await binaryStorage.save({
        key: storageKey,
        content: image.buffer,
    });
    return {
        storageKey: stored.key,
        fileName: safeFileName(image.originalname, `product-${productId}.${format.extension}`),
        mimeType: format.mimeType,
        fileSizeBytes: stored.sizeBytes,
        sha256: stored.sha256,
    };
}
export function removeStoredProductImage(storageKey: string): Promise<void> {
    return binaryStorage.delete(storageKey);
}
export async function readStoredProductImage(image: ProductImageAsset): Promise<Buffer> {
    try {
        return await binaryStorage.read(image.storageKey);
    }
    catch {
        throw new AppError(500, "La imagen del producto no está disponible en el almacenamiento.", "PRODUCT_IMAGE_STORAGE_ERROR");
    }
}
