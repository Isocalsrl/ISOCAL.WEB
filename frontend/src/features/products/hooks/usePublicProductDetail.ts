import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import {
    ApiError,
} from "../../../shared/api/httpClient";

import {
    getPublicCategory,
} from "../../categories/api/publicCategories.api";

import type {
    PublicCategory,
} from "../../categories/types/category.types";

import {
    getPublicProduct,
} from "../api/publicProducts.api";

import type {
    PublicProduct,
} from "../types/product.types";

interface PublicProductDetail {
    product:
        PublicProduct;

    category:
        PublicCategory | null;
}

async function fetchProductDetail(
    productId:
        number,
): Promise<PublicProductDetail> {
    const product =
        await getPublicProduct(
            productId,
        );

    if (
        product.categoryId ===
        null
    ) {
        return {
            product,
            category:
                null,
        };
    }

    try {
        const category =
            await getPublicCategory(
                product.categoryId,
            );

        return {
            product,
            category,
        };
    } catch {
        return {
            product,
            category:
                null,
        };
    }
}

function parseProductId(
    value:
        string | undefined,
): number | null {
    if (!value) {
        return null;
    }

    const parsed =
        Number(
            value,
        );

    if (
        !Number.isInteger(
            parsed,
        ) ||
        parsed <= 0
    ) {
        return null;
    }

    return parsed;
}

export function usePublicProductDetail() {
    const {
        productId,
    } =
        useParams();

    const [
        searchParams,
    ] =
        useSearchParams();

    const navigate =
        useNavigate();

    const [
        product,
        setProduct,
    ] = useState<
        PublicProduct | null
    >(null);

    const [
        category,
        setCategory,
    ] = useState<
        PublicCategory | null
    >(null);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<
        string | null
    >(null);

    const returnCategory =
        searchParams.get(
            "categoria",
        );

    const catalogReturnUrl =
        returnCategory
            ? `/productos?categoria=${encodeURIComponent(
                  returnCategory,
              )}`
            : "/productos";

    useEffect(() => {
        let isActive =
            true;

        const parsedProductId =
            parseProductId(
                productId,
            );

        queueMicrotask(() => {
            if (!isActive) {
                return;
            }

            setProduct(null);
            setCategory(null);
            setErrorMessage(null);
        });

        if (
            parsedProductId ===
            null
        ) {
            queueMicrotask(() => {
                if (!isActive) {
                    return;
                }

                setErrorMessage(
                    "El producto solicitado no es válido.",
                );

                setIsLoading(false);
            });

            return () => {
                isActive =
                    false;
            };
        }

        queueMicrotask(() => {
            if (isActive) {
                setIsLoading(true);
            }
        });

        void fetchProductDetail(
            parsedProductId,
        )
            .then(
                (
                    detail,
                ) => {
                    if (
                        !isActive
                    ) {
                        return;
                    }

                    setProduct(
                        detail.product,
                    );

                    setCategory(
                        detail.category,
                    );
                },
            )
            .catch(
                (
                    error:
                        unknown,
                ) => {
                    if (
                        !isActive
                    ) {
                        return;
                    }

                    setErrorMessage(
                        error instanceof
                            ApiError
                            ? error.message
                            : "No se pudo cargar el producto.",
                    );
                },
            )
            .finally(() => {
                if (
                    isActive
                ) {
                    setIsLoading(
                        false,
                    );
                }
            });

        return () => {
            isActive =
                false;
        };
    }, [
        productId,
    ]);

    return {
        product,
        category,
        isLoading,
        errorMessage,
        catalogReturnUrl,
        goToCatalog: () => {
            navigate(
                "/productos",
            );
        },
    };
}
