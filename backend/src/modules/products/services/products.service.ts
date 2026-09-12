import { withTransaction } from "../../../database/transaction.js";
import { AppError } from "../../../shared/errors/AppError.js";
import type { Admin, AdminRole } from "../../auth/auth.types.js";
import * as productsRepository from "../repositories/index.js";
import type {
    CreateProductInput,
    Product,
    ProductImageAsset,
    UpdateProductInput,
    UploadedProductImage,
} from "../products.types.js";
import { validateCategory } from "../validators/products.business.validator.js";
import {
    readStoredProductImage,
    removeStoredProductImage,
    storeProductImage,
} from "./productImage.service.js";
import { normalizeCreateInput, normalizeUpdateInput } from "./products.normalizer.js";
import {
    assertCanModifyProduct,
    assertCanSetProductState,
} from "./products.permissions.js";

export async function getProducts(): Promise<Product[]> {
    return productsRepository.findAllActive();
}

export async function getAdminProducts(role: AdminRole): Promise<Product[]> {
    return role === "super_admin"
        ? productsRepository.findAll()
        : productsRepository.findAllActive();
}

export async function getProductById(id: number): Promise<Product> {
    const product = await productsRepository.findActiveById(id);

    if (!product) {
        throw new AppError(404, "Producto no encontrado.", "PRODUCT_NOT_FOUND");
    }

    return product;
}

export async function getAdminProductById(
    id: number,
    role: AdminRole,
): Promise<Product> {
    const product = await productsRepository.findById(id);

    if (!product || (!product.isActive && role !== "super_admin")) {
        throw new AppError(404, "Producto no encontrado.", "PRODUCT_NOT_FOUND");
    }

    return product;
}

async function loadProduct(id: number): Promise<Product> {
    const product = await productsRepository.findById(id);

    if (!product) {
        throw new AppError(404, "Producto no encontrado.", "PRODUCT_NOT_FOUND");
    }

    return product;
}

export async function createProduct(
    input: CreateProductInput,
    image: UploadedProductImage | undefined,
    admin: Admin,
): Promise<Product> {
    if (!image) {
        throw new AppError(
            400,
            "La imagen del producto es obligatoria.",
            "PRODUCT_IMAGE_REQUIRED",
        );
    }

    assertCanSetProductState(input, admin.role);

    const normalizedInput = normalizeCreateInput(input);
    await validateCategory(normalizedInput.categoryId);

    let storedKey: string | null = null;

    try {
        const productId = await withTransaction(async (client) => {
            const product = await productsRepository.create(client, normalizedInput);
            const storedImage = await storeProductImage(product.id, image);

            storedKey = storedImage.storageKey;

            await productsRepository.replaceCurrentProductImage(client, {
                productId: product.id,
                ...storedImage,
                createdBy: admin.id,
            });

            return product.id;
        });

        return loadProduct(productId);
    } catch (error) {
        if (storedKey) {
            await removeStoredProductImage(storedKey).catch(() => undefined);
        }

        throw error;
    }
}

export async function updateProduct(
    id: number,
    input: UpdateProductInput,
    image: UploadedProductImage | undefined,
    admin: Admin,
): Promise<Product> {
    assertCanSetProductState(input, admin.role);

    const normalizedInput = normalizeUpdateInput(input);
    await validateCategory(normalizedInput.categoryId);

    if (Object.keys(normalizedInput).length === 0 && !image) {
        throw new AppError(
            400,
            "Debes enviar al menos un campo o una imagen para actualizar.",
            "VALIDATION_ERROR",
        );
    }

    let storedKey: string | null = null;

    try {
        await withTransaction(async (client) => {
            const existing = await productsRepository.findByIdForUpdate(client, id);

            if (!existing) {
                throw new AppError(404, "Producto no encontrado.", "PRODUCT_NOT_FOUND");
            }

            assertCanModifyProduct(existing, admin.role);

            const hasImage = await productsRepository.hasCurrentProductImage(client, id);

            if (!hasImage && !image) {
                throw new AppError(
                    400,
                    "Este producto todavía no tiene imagen. Debes cargar una para poder actualizarlo.",
                    "PRODUCT_IMAGE_REQUIRED",
                );
            }

            if (Object.keys(normalizedInput).length > 0) {
                await productsRepository.update(client, id, normalizedInput);
            }

            if (!image) {
                return;
            }

            const storedImage = await storeProductImage(id, image);
            storedKey = storedImage.storageKey;

            await productsRepository.replaceCurrentProductImage(client, {
                productId: id,
                ...storedImage,
                createdBy: admin.id,
            });

            if (Object.keys(normalizedInput).length === 0) {
                await productsRepository.touch(client, id);
            }
        });
    } catch (error) {
        if (storedKey) {
            await removeStoredProductImage(storedKey).catch(() => undefined);
        }

        throw error;
    }

    return loadProduct(id);
}

export async function getProductImage(
    id: number,
): Promise<{ image: ProductImageAsset; content: Buffer }> {
    const product = await productsRepository.findById(id);

    if (!product) {
        throw new AppError(404, "Producto no encontrado.", "PRODUCT_NOT_FOUND");
    }

    const image = await productsRepository.findCurrentProductImage(id);

    if (!image) {
        throw new AppError(
            404,
            "El producto no tiene una imagen disponible.",
            "PRODUCT_IMAGE_NOT_FOUND",
        );
    }

    return {
        image,
        content: await readStoredProductImage(image),
    };
}

export async function deactivateProduct(id: number): Promise<Product> {
    const product = await productsRepository.deactivate(id);

    if (!product) {
        throw new AppError(404, "Producto no encontrado.", "PRODUCT_NOT_FOUND");
    }

    return loadProduct(id);
}
