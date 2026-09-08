import { AppError } from "../../../shared/errors/AppError.js";
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

export async function createProduct(
    input: CreateProductInput,
): Promise<Product> {
    const normalizedInput = normalizeCreateInput(input);

    await validateCategory(normalizedInput.categoryId);

    return productsRepository.create(normalizedInput);
}

export async function updateProduct(
    id: number,
    input: UpdateProductInput,
): Promise<Product> {
    const existingProduct = await productsRepository.findById(id);

    if (!existingProduct) {
        throw new AppError(
            404,
            "Producto no encontrado.",
            "PRODUCT_NOT_FOUND",
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
