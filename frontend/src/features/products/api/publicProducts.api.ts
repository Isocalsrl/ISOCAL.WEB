import {
    request,
} from "../../../shared/api/httpClient";

import type {
    PublicProduct,
} from "../types/product.types";

const PUBLIC_PRODUCTS_PATH =
    "/api/products";

export function listPublicProducts():
    Promise<PublicProduct[]> {
    return request<
        PublicProduct[]
    >(
        PUBLIC_PRODUCTS_PATH,
    );
}

export function getPublicProduct(
    id: number,
): Promise<PublicProduct> {
    return request<
        PublicProduct
    >(
        `${PUBLIC_PRODUCTS_PATH}/${id}`,
    );
}