import {
    useState,
} from "react";

import {
    useLocation,
} from "react-router-dom";

import {
    ApiError,
} from "../../../shared/api/httpClient";

import * as productsApi
    from "../api/products.api";

import type {
    Product,
} from "../types/product.types";

import {
    useProductsCollection,
} from "./useProductsCollection";

interface ProductsLocationState {
    message?: string;
}

export function useProductsManagement(
    isSuperAdmin:
        boolean,
) {
    const location =
        useLocation();

    const collection =
        useProductsCollection();

    const [
        actionErrorMessage,
        setActionErrorMessage,
    ] = useState<string | null>(
        null,
    );

    const [
        successMessage,
        setSuccessMessage,
    ] = useState<string | null>(
        (
            location.state as
                ProductsLocationState |
                null
        )?.message ?? null,
    );

    const [
        productToDeactivate,
        setProductToDeactivate,
    ] = useState<Product | null>(
        null,
    );

    const [
        isDeactivating,
        setIsDeactivating,
    ] = useState(false);

    const [
        reactivatingProductId,
        setReactivatingProductId,
    ] = useState<number | null>(null);

    function clearMessages(): void {
        setActionErrorMessage(
            null,
        );
        setSuccessMessage(
            null,
        );
    }

    async function loadData():
        Promise<void> {
        setActionErrorMessage(
            null,
        );
        await collection.loadData();
    }

    async function deactivateProduct():
        Promise<void> {
        if (
            !productToDeactivate
        ) {
            return;
        }

        clearMessages();
        setIsDeactivating(
            true,
        );

        try {
            const deactivatedProduct =
                await productsApi
                    .deactivateProduct(
                        productToDeactivate.id,
                    );

            if (isSuperAdmin) {
                collection.replaceProduct(
                    deactivatedProduct,
                );
            } else {
                collection.removeProduct(
                    productToDeactivate.id,
                );
            }

            setSuccessMessage(
                "Producto desactivado correctamente.",
            );
            setProductToDeactivate(
                null,
            );
        } catch (error) {
            setActionErrorMessage(
                error instanceof ApiError
                    ? error.message
                    : "No se pudo desactivar el producto.",
            );
        } finally {
            setIsDeactivating(
                false,
            );
        }
    }

    async function reactivateProduct(
        product:
            Product,
    ): Promise<void> {
        clearMessages();
        setReactivatingProductId(
            product.id,
        );

        try {
            const reactivatedProduct =
                await productsApi
                    .reactivateProduct(
                        product.id,
                    );

            collection.replaceProduct(
                reactivatedProduct,
            );
            setSuccessMessage(
                "Producto reactivado correctamente.",
            );
        } catch (error) {
            setActionErrorMessage(
                error instanceof ApiError
                    ? error.message
                    : "No se pudo reactivar el producto.",
            );
        } finally {
            setReactivatingProductId(
                null,
            );
        }
    }

    return {
        products:
            collection.products,
        categoryNames:
            collection.categoryNames,
        isLoading:
            collection.isLoading,
        errorMessage:
            collection.loadErrorMessage ??
            actionErrorMessage,
        successMessage,
        productToDeactivate,
        isDeactivating,
        reactivatingProductId,
        loadData,
        requestDeactivate:
            setProductToDeactivate,
        cancelDeactivate: () => {
            setProductToDeactivate(
                null,
            );
        },
        deactivateProduct,
        reactivateProduct,
    };
}
