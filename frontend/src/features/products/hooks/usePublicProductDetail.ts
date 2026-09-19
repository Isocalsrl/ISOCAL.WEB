import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ApiError } from "../../../shared/api/httpClient";
import { getPublicCategory } from "../../categories/api/publicCategories.api";
import type { PublicCategory } from "../../categories/types/category.types";
import { getPublicProduct, listPublicProducts } from "../api/publicProducts.api";
import type { PublicProduct } from "../types/product.types";
import { getProductDetailReturnTarget, parseProductId } from "../model/productDetailNavigation";

interface PublicProductDetail {
    product: PublicProduct;
    category: PublicCategory | null;
    relatedProducts: PublicProduct[];
}

export type ProductDetailErrorKind =
    | "not-found"
    | "network"
    | "generic";

async function fetchProductDetail(productId: number): Promise<PublicProductDetail> {
    const product = await getPublicProduct(productId);

    if (product.categoryId === null) {
        return {
            product,
            category: null,
            relatedProducts: [],
        };
    }

    const [category, products] = await Promise.all([
        getPublicCategory(product.categoryId).catch(() => null),
        listPublicProducts().catch(() => [] as PublicProduct[]),
    ]);

    const relatedProducts = products
        .filter(
            (candidate) =>
                candidate.id !== product.id &&
                candidate.categoryId === product.categoryId,
        )
        .slice(0, 3);

    return {
        product,
        category,
        relatedProducts,
    };
}

export function usePublicProductDetail() {
    const {productId} = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState<PublicProduct | null>(null);
    const [category, setCategory] = useState<PublicCategory | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<PublicProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [errorKind, setErrorKind] = useState<ProductDetailErrorKind | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    const returnTarget = getProductDetailReturnTarget({
        categorySlug: searchParams.get("categoria"),
        origin: searchParams.get("origen"),
    });

    const reload = useCallback(() => {
        setReloadKey((currentValue) => currentValue + 1);
    }, []);

    useEffect(() => {
        let isActive = true;
        const parsedProductId = parseProductId(productId);

        queueMicrotask(() => {
            if (!isActive) return;
            setProduct(null);
            setCategory(null);
            setRelatedProducts([]);
            setErrorMessage(null);
            setErrorKind(null);
        });

        if (parsedProductId === null) {
            queueMicrotask(() => {
                if (!isActive) return;
                setErrorKind("not-found");
                setErrorMessage("La dirección de este producto no es válida.");
                setIsLoading(false);
            });

            return () => {
                isActive = false;
            };
        }

        queueMicrotask(() => {
            if (isActive) setIsLoading(true);
        });

        void fetchProductDetail(parsedProductId)
            .then((detail) => {
                if (!isActive) return;
                setProduct(detail.product);
                setCategory(detail.category);
                setRelatedProducts(detail.relatedProducts);
            })
            .catch((error: unknown) => {
                if (!isActive) return;

                if (error instanceof ApiError && error.status === 404) {
                    setErrorKind("not-found");
                    setErrorMessage("El producto fue retirado, cambió de dirección o ya no está publicado.");
                    return;
                }

                const isNetworkError =
                    error instanceof ApiError &&
                    (error.status === 0 || error.code === "NETWORK_ERROR");

                setErrorKind(isNetworkError ? "network" : "generic");
                setErrorMessage(
                    isNetworkError
                        ? "No pudimos conectar con el servidor para cargar este producto."
                        : error instanceof ApiError
                          ? error.message
                          : "No pudimos cargar la información del producto.",
                );
            })
            .finally(() => {
                if (isActive) setIsLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, [productId, reloadKey]);

    return {
        product,
        category,
        relatedProducts,
        isLoading,
        errorMessage,
        errorKind,
        reload,
        returnUrl: returnTarget.url,
        returnLabel: returnTarget.label,
        goToReturnPage: () => {
            navigate(returnTarget.url);
        },
    };
}
