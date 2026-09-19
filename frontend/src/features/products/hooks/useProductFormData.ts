import { useEffect, useState } from "react";
import { ApiError } from "../../../shared/api/httpClient";
import * as categoriesApi from "../../categories/api/categories.api";
import type { Category } from "../../categories/types/category.types";
import * as productsApi from "../api/products.api";
import type { Product } from "../types/product.types";

interface UseProductFormDataOptions {
    isEditing: boolean;
    productId: number;
}

export function useProductFormData({
    isEditing,
    productId,
}: UseProductFormDataOptions) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let isActive = true;

        async function load(): Promise<void> {
            setErrorMessage(null);
            setIsLoading(true);
            setProduct(null);

            try {
                if (
                    isEditing &&
                    (!Number.isInteger(productId) || productId <= 0)
                ) {
                    throw new Error("Identificador inválido.");
                }

                const [nextCategories, nextProduct] = await Promise.all([
                    categoriesApi.listCategories(),
                    isEditing
                        ? productsApi.getProduct(productId)
                        : Promise.resolve(null),
                ]);

                if (!isActive) {
                    return;
                }

                setCategories(
                    nextCategories.filter((category) => category.isActive),
                );
                setProduct(nextProduct);
            } catch (error) {
                if (isActive) {
                    setErrorMessage(
                        error instanceof ApiError
                            ? error.message
                            : "No se pudo preparar el formulario.",
                    );
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        void load();

        return () => {
            isActive = false;
        };
    }, [isEditing, productId]);

    return {
        categories,
        product,
        isLoading,
        errorMessage,
    };
}
