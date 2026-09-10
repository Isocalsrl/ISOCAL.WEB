import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useLocation,
} from "react-router-dom";

import {
    ApiError,
} from "../../../shared/api/httpClient";

import {
    InlineAlert,
} from "../../../shared/components/feedback/InlineAlert";

import {
    ActionLink,
} from "../../../shared/components/ui/ActionLink";

import {
    Button,
} from "../../../shared/components/ui/Button";

import {
    ConfirmDialog,
} from "../../../shared/components/ui/ConfirmDialog";

import {
    SectionState,
} from "../../../shared/components/ui/SectionState";

import {
    ManagementHeader,
} from "../../admin/components/ManagementHeader";

import * as categoriesApi
    from "../../categories/api/categories.api";

import type {
    Category,
} from "../../categories/types/category.types";

import * as productsApi
    from "../api/products.api";

import type {
    Product,
} from "../types/product.types";

interface ProductsLocationState {
    message?: string;
}

async function fetchProductsData(): Promise<{
    products: Product[];
    categories: Category[];
}> {
    const [
        products,
        categories,
    ] = await Promise.all([
        productsApi.listProducts(),
        categoriesApi.listCategories(),
    ]);

    return {
        products,
        categories,
    };
}

export function ProductsPage() {
    const location =
        useLocation();

    const [
        products,
        setProducts,
    ] = useState<Product[]>([]);

    const [
        categories,
        setCategories,
    ] = useState<Category[]>([]);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        errorMessage,
        setErrorMessage,
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

    const loadData =
        useCallback(
            async (): Promise<void> => {
                setErrorMessage(null);
                setIsLoading(true);

                try {
                    const data =
                        await fetchProductsData();

                    setProducts(data.products);
                    setCategories(
                        data.categories,
                    );
                } catch (error) {
                    setErrorMessage(
                        error instanceof ApiError
                            ? error.message
                            : "No se pudo cargar el listado de productos.",
                    );
                } finally {
                    setIsLoading(false);
                }
            },
            [],
        );

    useEffect(() => {
        let isActive = true;

        void fetchProductsData()
            .then((data) => {
                if (!isActive) {
                    return;
                }

                setProducts(data.products);
                setCategories(data.categories);
            })
            .catch((error: unknown) => {
                if (isActive) {
                    setErrorMessage(
                        error instanceof ApiError
                            ? error.message
                            : "No se pudo cargar el listado de productos.",
                    );
                }
            })
            .finally(() => {
                if (isActive) {
                    setIsLoading(false);
                }
            });

        return () => {
            isActive = false;
        };
    }, []);

    const categoryNames =
        useMemo(
            () =>
                new Map(
                    categories.map(
                        (category) => [
                            category.id,
                            category.name,
                        ],
                    ),
                ),
            [categories],
        );

    async function handleDeactivate():
        Promise<void> {
        if (!productToDeactivate) {
            return;
        }

        setErrorMessage(null);
        setSuccessMessage(null);
        setIsDeactivating(true);

        try {
            await productsApi
                .deactivateProduct(
                    productToDeactivate.id,
                );

            setProducts(
                (currentProducts) =>
                    currentProducts.filter(
                        (product) =>
                            product.id !==
                            productToDeactivate.id,
                    ),
            );

            setSuccessMessage(
                "Producto desactivado correctamente.",
            );

            setProductToDeactivate(null);
        } catch (error) {
            setErrorMessage(
                error instanceof ApiError
                    ? error.message
                    : "No se pudo desactivar el producto.",
            );
        } finally {
            setIsDeactivating(false);
        }
    }

    return (
        <section className="management-page">
            <ManagementHeader
                eyebrow="Catálogo"
                title="Productos"
                description="Administra la información visible en el catálogo público."
                actions={
                    <ActionLink to="/admin/products/new">
                        Nuevo producto
                    </ActionLink>
                }
            />

            {successMessage && (
                <InlineAlert variant="success">
                    {successMessage}
                </InlineAlert>
            )}

            {errorMessage &&
                products.length > 0 && (
                    <InlineAlert>
                        {errorMessage}
                    </InlineAlert>
                )}

            {isLoading ? (
                <SectionState
                    title="Cargando productos"
                    description="Estamos consultando la información del catálogo."
                    isLoading
                />
            ) : errorMessage &&
              products.length === 0 ? (
                <SectionState
                    title="No se pudo cargar el catálogo"
                    description={errorMessage}
                    actionLabel="Reintentar"
                    onAction={() => {
                        void loadData();
                    }}
                />
            ) : products.length === 0 ? (
                <SectionState
                    title="No hay productos activos"
                    description="Registra el primer producto para comenzar a completar el catálogo."
                />
            ) : (
                <>
                    <div className="management-summary">
                        <p className="management-count">
                            <strong>
                                {products.length}
                            </strong>{" "}
                            productos activos
                        </p>
                    </div>

                    <div className="data-panel">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Descripción</th>
                                    <th>Estado</th>
                                    <th>
                                        <span className="sr-only">
                                            Acciones
                                        </span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map(
                                    (product) => (
                                        <tr key={product.id}>
                                            <td>
                                                <div className="data-primary">
                                                    <strong>
                                                        {product.name}
                                                    </strong>

                                                    <span>
                                                        /{product.slug}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                {product.categoryId
                                                    ? categoryNames.get(
                                                          product.categoryId,
                                                      ) ??
                                                      "Sin categoría"
                                                    : "Sin categoría"}
                                            </td>

                                            <td>
                                                <span className="data-description">
                                                    {product.description ??
                                                        "Sin descripción"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="status-badge">
                                                    Activo
                                                </span>
                                            </td>

                                            <td>
                                                <div className="data-actions">
                                                    <ActionLink
                                                        to={`/admin/products/${product.id}/edit`}
                                                        variant="secondary"
                                                    >
                                                        Editar
                                                    </ActionLink>

                                                    <Button
                                                        type="button"
                                                        variant="danger"
                                                        onClick={() => {
                                                            setProductToDeactivate(
                                                                product,
                                                            );
                                                        }}
                                                    >
                                                        Desactivar
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            <ConfirmDialog
                isOpen={
                    productToDeactivate !==
                    null
                }
                title="Desactivar producto"
                description={`El producto “${productToDeactivate?.name ?? ""}” dejará de mostrarse en el catálogo.`}
                confirmLabel="Desactivar producto"
                isConfirming={isDeactivating}
                onCancel={() => {
                    setProductToDeactivate(null);
                }}
                onConfirm={() => {
                    void handleDeactivate();
                }}
            />
        </section>
    );
}
