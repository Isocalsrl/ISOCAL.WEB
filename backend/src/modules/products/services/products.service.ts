import { db } from "../../../database/db.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { buildStorageKey } from "../../../shared/storage/providers/localFileStorage.provider.js";
import { binaryStorage } from "../../../shared/storage/storageService.js";
import type { Admin, AdminRole } from "../../auth/auth.types.js";
import * as productsRepository from "../repositories/index.js";
import type { CreateProductInput, Product, ProductImageAsset, UpdateProductInput, UploadedProductImage } from "../products.types.js";
import { validateCategory } from "../validators/products.business.validator.js";
import { validateProductImage } from "../validators/products.image.validator.js";
import { normalizeCreateInput, normalizeUpdateInput } from "./products.normalizer.js";

export async function getProducts(): Promise<Product[]> { return productsRepository.findAllActive(); }
export async function getAdminProducts(role: AdminRole): Promise<Product[]> {
    return role === "super_admin" ? productsRepository.findAll() : productsRepository.findAllActive();
}
export async function getProductById(id: number): Promise<Product> {
    const product = await productsRepository.findActiveById(id);
    if (!product) throw new AppError(404, "Producto no encontrado.", "PRODUCT_NOT_FOUND");
    return product;
}
export async function getAdminProductById(id: number, role: AdminRole): Promise<Product> {
    const product = await productsRepository.findById(id);
    if (!product || (!product.isActive && role !== "super_admin")) throw new AppError(404, "Producto no encontrado.", "PRODUCT_NOT_FOUND");
    return product;
}

function assertCanSetState(input: CreateProductInput | UpdateProductInput, role: AdminRole): void {
    if (input.isActive !== undefined && role !== "super_admin") throw new AppError(403, "Solo un superadministrador puede cambiar el estado de un producto.", "FORBIDDEN");
}
function assertCanModify(product: Product, role: AdminRole): void {
    if (!product.isActive && role !== "super_admin") throw new AppError(403, "Solo un superadministrador puede modificar un producto inactivo.", "FORBIDDEN");
}
function normalizeImageFileName(originalName: string, fallbackName: string): string {
    const leafName = originalName.replace(/\0/g, "").split(/[\\/]/).at(-1)?.trim();
    return (leafName || fallbackName).slice(0, 255);
}
async function loadProduct(id: number): Promise<Product> {
    const product = await productsRepository.findById(id);
    if (!product) throw new AppError(404, "Producto no encontrado.", "PRODUCT_NOT_FOUND");
    return product;
}

export async function createProduct(input: CreateProductInput, image: UploadedProductImage | undefined, admin: Admin): Promise<Product> {
    if (!image) throw new AppError(400, "La imagen del producto es obligatoria.", "PRODUCT_IMAGE_REQUIRED");
    assertCanSetState(input, admin.role);
    const normalizedInput = normalizeCreateInput(input);
    await validateCategory(normalizedInput.categoryId);
    const imageFormat = validateProductImage(image);
    const client = await db.connect();
    let storedKey: string | null = null;
    try {
        await client.query("BEGIN");
        const product = await productsRepository.create(client, normalizedInput);
        const storageKey = buildStorageKey({ resourceType: "products", resourceId: product.id, assetRole: "image", extension: imageFormat.extension });
        const stored = await binaryStorage.save({ key: storageKey, content: image.buffer });
        storedKey = stored.key;
        await productsRepository.replaceCurrentProductImage(client, { productId: product.id, storageKey: stored.key, fileName: normalizeImageFileName(image.originalname, `product-${product.id}.${imageFormat.extension}`), mimeType: imageFormat.mimeType, fileSizeBytes: stored.sizeBytes, sha256: stored.sha256, createdBy: admin.id });
        await client.query("COMMIT");
        return loadProduct(product.id);
    } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        if (storedKey) await binaryStorage.delete(storedKey).catch(() => undefined);
        throw error;
    } finally { client.release(); }
}

export async function updateProduct(id: number, input: UpdateProductInput, image: UploadedProductImage | undefined, admin: Admin): Promise<Product> {
    assertCanSetState(input, admin.role);
    const normalizedInput = normalizeUpdateInput(input);
    await validateCategory(normalizedInput.categoryId);
    if (Object.keys(normalizedInput).length === 0 && !image) throw new AppError(400, "Debes enviar al menos un campo o una imagen para actualizar.", "VALIDATION_ERROR");
    const imageFormat = image ? validateProductImage(image) : null;
    const client = await db.connect();
    let storedKey: string | null = null;
    try {
        await client.query("BEGIN");
        const existing = await productsRepository.findByIdForUpdate(client, id);
        if (!existing) throw new AppError(404, "Producto no encontrado.", "PRODUCT_NOT_FOUND");
        assertCanModify(existing, admin.role);
        const hasImage = await productsRepository.hasCurrentProductImage(client, id);
        if (!hasImage && !image) throw new AppError(400, "Este producto todavía no tiene imagen. Debes cargar una para poder actualizarlo.", "PRODUCT_IMAGE_REQUIRED");
        if (Object.keys(normalizedInput).length > 0) await productsRepository.update(client, id, normalizedInput);
        if (image && imageFormat) {
            const storageKey = buildStorageKey({ resourceType: "products", resourceId: id, assetRole: "image", extension: imageFormat.extension });
            const stored = await binaryStorage.save({ key: storageKey, content: image.buffer });
            storedKey = stored.key;
            await productsRepository.replaceCurrentProductImage(client, { productId: id, storageKey: stored.key, fileName: normalizeImageFileName(image.originalname, `product-${id}.${imageFormat.extension}`), mimeType: imageFormat.mimeType, fileSizeBytes: stored.sizeBytes, sha256: stored.sha256, createdBy: admin.id });
            if (Object.keys(normalizedInput).length === 0) await productsRepository.touch(client, id);
        }
        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK").catch(() => undefined);
        if (storedKey) await binaryStorage.delete(storedKey).catch(() => undefined);
        throw error;
    } finally { client.release(); }
    return loadProduct(id);
}

export async function getProductImage(id: number): Promise<{ image: ProductImageAsset; content: Buffer }> {
    const product = await productsRepository.findById(id);
    if (!product) throw new AppError(404, "Producto no encontrado.", "PRODUCT_NOT_FOUND");
    const image = await productsRepository.findCurrentProductImage(id);
    if (!image) throw new AppError(404, "El producto no tiene una imagen disponible.", "PRODUCT_IMAGE_NOT_FOUND");
    try { return { image, content: await binaryStorage.read(image.storageKey) }; }
    catch { throw new AppError(500, "La imagen del producto no está disponible en el almacenamiento.", "PRODUCT_IMAGE_STORAGE_ERROR"); }
}

export async function deactivateProduct(id: number): Promise<Product> {
    const product = await productsRepository.deactivate(id);
    if (!product) throw new AppError(404, "Producto no encontrado.", "PRODUCT_NOT_FOUND");
    return loadProduct(id);
}
