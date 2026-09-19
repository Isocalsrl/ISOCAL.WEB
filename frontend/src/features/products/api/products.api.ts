import { request } from "../../../shared/api/httpClient";
import type { Product, ProductInput, ProductUpdateInput } from "../types/product.types";

const ADMIN_PRODUCTS_PATH =
    "/api/admin/products";

export function listProducts():
    Promise<Product[]> {
    return request<Product[]>(
        ADMIN_PRODUCTS_PATH,
    );
}

function buildProductFormData(input: ProductInput | ProductUpdateInput): FormData {
    const formData = new FormData();
    if (input.name !== undefined) formData.append("name", input.name);
    if (input.slug !== undefined) formData.append("slug", input.slug);
    if (input.description !== undefined) formData.append("description", input.description ?? "");
    if (input.categoryId !== undefined) formData.append("categoryId", input.categoryId === null ? "" : String(input.categoryId));
    if ("isActive" in input && input.isActive !== undefined) formData.append("isActive", String(input.isActive));
    if (input.image) formData.append("image", input.image);
    return formData;
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
            body: buildProductFormData(input),
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
            body: buildProductFormData(input),
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
