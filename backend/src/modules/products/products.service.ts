import { withTransaction } from "../../database/transaction.js";
import { AppError } from "../../shared/errors/AppError.js";
import type { AdminActor, AdminRole } from "../../shared/auth/adminRole.js";
import { readStoredProductImage, removeStoredProductImage, storeProductImage } from "./productImage.service.js";
import * as repository from "./products.repository.js";
import type { CreateProductInput, Product, ProductImageAsset, UpdateProductInput, UploadedProductImage } from "./products.types.js";
function notFound(): AppError {
    return new AppError(404, "Producto no encontrado.", "PRODUCT_NOT_FOUND");
}
function normalizeCreate(input: CreateProductInput): CreateProductInput {
    return {
        ...input,
        name: input.name.trim(),
        slug: input.slug.trim().toLowerCase(),
        description: input.description?.trim() || null,
    };
}
function normalizeUpdate(input: UpdateProductInput): UpdateProductInput {
    return {
        ...(input.name !== undefined && { name: input.name.trim() }),
        ...(input.slug !== undefined && { slug: input.slug.trim().toLowerCase() }),
        ...(input.description !== undefined && {
            description: input.description?.trim() || null,
        }),
        ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
    };
}
function assertCanSetState(input: CreateProductInput | UpdateProductInput, role: AdminRole): void {
    if (input.isActive !== undefined && role !== "super_admin") {
        throw new AppError(403, "Solo un superadministrador puede cambiar el estado de un producto.", "FORBIDDEN");
    }
}
function assertCanModify(product: Product, role: AdminRole): void {
    if (!product.isActive && role !== "super_admin") {
        throw new AppError(403, "Solo un superadministrador puede modificar un producto inactivo.", "FORBIDDEN");
    }
}
async function validateCategory(categoryId: number | null | undefined): Promise<void> {
    if (categoryId == null)
        return;
    if (!(await repository.categoryExists(categoryId))) {
        throw new AppError(400, "La categoría indicada no existe o está inactiva.", "INVALID_CATEGORY");
    }
}
async function requireProduct(id: number): Promise<Product> {
    const product = await repository.findById(id);
    if (!product)
        throw notFound();
    return product;
}
export function getProducts(): Promise<Product[]> {
    return repository.findAll(true);
}
export function getAdminProducts(role: AdminRole): Promise<Product[]> {
    return repository.findAll(role !== "super_admin");
}
export function getActiveProductsByCategory(categoryId: number): Promise<Product[]> {
    return repository.findActiveByCategory(categoryId);
}
export async function getProductById(id: number): Promise<Product> {
    const product = await repository.findById(id, true);
    if (!product)
        throw notFound();
    return product;
}
export async function getAdminProductById(id: number, role: AdminRole): Promise<Product> {
    const product = await repository.findById(id);
    if (!product || (!product.isActive && role !== "super_admin")) {
        throw notFound();
    }
    return product;
}
export async function createProduct(input: CreateProductInput, image: UploadedProductImage | undefined, admin: AdminActor): Promise<Product> {
    if (!image) {
        throw new AppError(400, "La imagen del producto es obligatoria.", "PRODUCT_IMAGE_REQUIRED");
    }
    assertCanSetState(input, admin.role);
    const normalized = normalizeCreate(input);
    await validateCategory(normalized.categoryId);
    let orphanedStorageKey: string | null = null;
    try {
        const productId = await withTransaction(async (client) => {
            const product = await repository.create(client, normalized);
            const storedImage = await storeProductImage(product.id, image);
            orphanedStorageKey = storedImage.storageKey;
            await repository.replaceCurrentImage(client, {
                productId: product.id,
                ...storedImage,
                createdBy: admin.id,
            });
            return product.id;
        });
        return requireProduct(productId);
    }
    catch (error) {
        if (orphanedStorageKey) {
            await removeStoredProductImage(orphanedStorageKey).catch(() => undefined);
        }
        throw error;
    }
}
export async function updateProduct(id: number, input: UpdateProductInput, image: UploadedProductImage | undefined, admin: AdminActor): Promise<Product> {
    assertCanSetState(input, admin.role);
    const normalized = normalizeUpdate(input);
    const hasFieldChanges = Object.keys(normalized).length > 0;
    await validateCategory(normalized.categoryId);
    if (!hasFieldChanges && !image) {
        throw new AppError(400, "Debes enviar al menos un campo o una imagen para actualizar.", "VALIDATION_ERROR");
    }
    let orphanedStorageKey: string | null = null;
    try {
        await withTransaction(async (client) => {
            const existing = await repository.findByIdForUpdate(client, id);
            if (!existing)
                throw notFound();
            assertCanModify(existing, admin.role);
            const hasCurrentImage = await repository.hasCurrentImage(client, id);
            if (!hasCurrentImage && !image) {
                throw new AppError(400, "Este producto todavía no tiene imagen. Debes cargar una para poder actualizarlo.", "PRODUCT_IMAGE_REQUIRED");
            }
            if (hasFieldChanges) {
                await repository.update(client, id, normalized);
            }
            if (!image)
                return;
            const storedImage = await storeProductImage(id, image);
            orphanedStorageKey = storedImage.storageKey;
            await repository.replaceCurrentImage(client, {
                productId: id,
                ...storedImage,
                createdBy: admin.id,
            });
            if (!hasFieldChanges) {
                await repository.touch(client, id);
            }
        });
    }
    catch (error) {
        if (orphanedStorageKey) {
            await removeStoredProductImage(orphanedStorageKey).catch(() => undefined);
        }
        throw error;
    }
    return requireProduct(id);
}
export async function getProductImage(id: number): Promise<{
    image: ProductImageAsset;
    content: Buffer;
}> {
    await requireProduct(id);
    const image = await repository.findCurrentImage(id);
    if (!image) {
        throw new AppError(404, "El producto no tiene una imagen disponible.", "PRODUCT_IMAGE_NOT_FOUND");
    }
    return {
        image,
        content: await readStoredProductImage(image),
    };
}
export async function deactivateProduct(id: number): Promise<Product> {
    const product = await repository.deactivate(id);
    if (!product)
        throw notFound();
    return requireProduct(id);
}
