import {
    request,
} from "../../../shared/api/httpClient";

import type {
    Product,
    ProductInput,
} from "../types/product.types";

const PUBLIC_PRODUCTS_PATH =
    "/api/products";

const ADMIN_PRODUCTS_PATH =
    "/api/admin/products";

export function listProducts():
    Promise<Product[]> {
    return request<Product[]>(
        PUBLIC_PRODUCTS_PATH,
    );
}

export function getProduct(
    id: number,
): Promise<Product> {
    return request<Product>(
        `${PUBLIC_PRODUCTS_PATH}/${id}`,
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
    input: ProductInput,
): Promise<Product> {
    return request<Product>(
        `${ADMIN_PRODUCTS_PATH}/${id}`,
        {
            method: "PATCH",
            body: JSON.stringify(input),
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
