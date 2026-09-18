import { request } from "../../../shared/api/httpClient";
import type { PublicCategory } from "../types/category.types";

const PUBLIC_CATEGORIES_PATH =
    "/api/categories";

export function listPublicCategories():
    Promise<PublicCategory[]> {
    return request<
        PublicCategory[]
    >(
        PUBLIC_CATEGORIES_PATH,
    );
}

export function getPublicCategory(
    id: number,
): Promise<PublicCategory> {
    return request<
        PublicCategory
    >(
        `${PUBLIC_CATEGORIES_PATH}/${id}`,
    );
}
