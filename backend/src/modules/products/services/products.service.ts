import { AppError } from "../../../shared/errors/AppError.js";
import type { AdminRole } from "../../auth/auth.types.js";
import * as productsRepository from "../repositories/index.js";
import {
    normalizeCreateInput,
    normalizeUpdateInput,
} from "./products.normalizer.js";
import { validateCategory } from "../validators/products.business.validator.js";
import type {
    CreateProductInput,
    Product,
    UpdateProductInput,
} from "../products.types.js";

export async function getProducts(): Promise<Product[]> {
    return productsRepository.findAllActive();
}

export async function getAdminProducts(
    role: AdminRole,
): Promise<Product[]> {
    return role === "super_admin"
        ? productsRepository.findAll()
        : productsRepository.findAllActive();
}

export async function getProductById(
    id: number,
): Promise<Product> {
    const product = await productsRepository.findActiveById(id);

    if (!product) {
        throw new AppError(
            404,
            "Producto no encontrado.",
            "PRODUCT_NOT_FOUND",
        );
    }

    return product;
}

export async function getAdminProductById(
    id: number,
    role: AdminRole,
): Promise<Product> {
    const product =
        await productsRepository.findById(id);

    if (
        !product ||
        (!product.isActive &&
            role !== "super_admin")
    ) {
        throw new AppError(
            404,
            "Producto no encontrado.",
            "PRODUCT_NOT_FOUND",
        );
    }

    return product;
}

export async function createProduct(
    input: CreateProductInput,
    role: AdminRole,
): Promise<Product> {
    if (
        input.isActive !== undefined &&
        role !== "super_admin"
    ) {
        throw new AppError(
            403,
            "Solo un superadministrador puede definir el estado de un producto.",
            "FORBIDDEN",
        );
    }

    const normalizedInput = normalizeCreateInput(input);

    await validateCategory(normalizedInput.categoryId);

    return productsRepository.create(normalizedInput);
}

export async function updateProduct(
    id: number,
    input: UpdateProductInput,
    role: AdminRole,
): Promise<Product> {
    const existingProduct = await productsRepository.findById(id);

    if (!existingProduct) {
        throw new AppError(
            404,
            "Producto no encontrado.",
            "PRODUCT_NOT_FOUND",
        );
    }

    if (
        !existingProduct.isActive &&
        role !== "super_admin"
    ) {
        throw new AppError(
            403,
            "Solo un superadministrador puede modificar un producto inactivo.",
            "FORBIDDEN",
        );
    }

    if (
        input.isActive !== undefined &&
        role !== "super_admin"
    ) {
        throw new AppError(
            403,
            "Solo un superadministrador puede cambiar el estado de un producto.",
            "FORBIDDEN",
        );
    }

    const normalizedInput = normalizeUpdateInput(input);

    await validateCategory(normalizedInput.categoryId);

    const updatedProduct = await productsRepository.update(id, normalizedInput);

    if (!updatedProduct) {
        throw new AppError(
            404,
            "Producto no encontrado.",
            "PRODUCT_NOT_FOUND",
        );
    }

    return updatedProduct;
}

export async function deactivateProduct(
    id: number,
): Promise<Product> {
    const product = await productsRepository.deactivate(id);

    if (!product) {
        throw new AppError(
            404,
            "Producto no encontrado.",
            "PRODUCT_NOT_FOUND",
        );
    }

    return product;
}
