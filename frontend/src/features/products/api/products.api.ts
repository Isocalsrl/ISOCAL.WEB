import {
    request,
} from "../../../shared/api/httpClient";

import type {
    Product,
    ProductInput,
    ProductUpdateInput,
} from "../types/product.types";

const ADMIN_PRODUCTS_PATH =
    "/api/admin/products";

export function listProducts():
    Promise<Product[]> {
    return request<Product[]>(
        ADMIN_PRODUCTS_PATH,
    );
}

export function getProduct(
    id: number,
): Promise<Product> {
    return request<Product>(
        `${ADMIN_PRODUCTS_PATH}/${id}`,
    );
}

export function createProduct(
    input: ProductInput,
): Promise<Product> {
    return request<Product>(
        ADMIN_PRODUCTS_PATH,
        {
            method: "POST",
            body: JSON.stringify(input),
        },
    );
}

export function updateProduct(
    id: number,
    input: ProductUpdateInput,
): Promise<Product> {
    return request<Product>(
        `${ADMIN_PRODUCTS_PATH}/${id}`,
        {
            method: "PATCH",
            body: JSON.stringify(input),
        },
    );
}

export function reactivateProduct(
    id: number,
): Promise<Product> {
    return updateProduct(
        id,
        {
            isActive: true,
        },
    );
}

export function deactivateProduct(
    id: number,
): Promise<Product> {
    return request<Product>(
        `${ADMIN_PRODUCTS_PATH}/${id}`,
        {
            method: "DELETE",
        },
    );
}
