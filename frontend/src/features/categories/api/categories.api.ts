import {
    request,
} from "../../../shared/api/httpClient";

import type {
    Category,
    CategoryInput,
    CategoryUpdateInput,
} from "../types/category.types";

const ADMIN_CATEGORIES_PATH =
    "/api/admin/categories";

export function listCategories():
    Promise<Category[]> {
    return request<Category[]>(
        ADMIN_CATEGORIES_PATH,
    );
}

export function createCategory(
    input: CategoryInput,
): Promise<Category> {
    return request<Category>(
        ADMIN_CATEGORIES_PATH,
        {
            method: "POST",
            body: JSON.stringify(input),
        },
    );
}

export function updateCategory(
    id: number,
    input: CategoryUpdateInput,
): Promise<Category> {
    return request<Category>(
        `${ADMIN_CATEGORIES_PATH}/${id}`,
        {
            method: "PATCH",
            body: JSON.stringify(input),
        },
    );
}

export function reactivateCategory(
    id: number,
): Promise<Category> {
    return updateCategory(
        id,
        {
            isActive: true,
        },
    );
}

export function deactivateCategory(
    id: number,
): Promise<Category> {
    return request<Category>(
        `${ADMIN_CATEGORIES_PATH}/${id}`,
        {
            method: "DELETE",
        },
    );
}
