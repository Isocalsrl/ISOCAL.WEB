import {
    InlineAlert,
} from "../../../shared/components/feedback/InlineAlert";

import {
    ActionLink,
} from "../../../shared/components/ui/ActionLink";

import {
    ConfirmDialog,
} from "../../../shared/components/ui/ConfirmDialog";

import {
    SectionState,
} from "../../../shared/components/ui/SectionState";

import {
    ManagementHeader,
} from "../../admin/components/ManagementHeader";

import {
    useAuth,
} from "../../auth/hooks/useAuth";

import {
    ProductsTable,
} from "../components/admin/ProductsTable";

import {
    useProductsManagement,
} from "../hooks/useProductsManagement";

export function ProductsPage() {
    const {
        admin,
    } = useAuth();

    const isSuperAdmin =
        admin?.role === "super_admin";

    const {
        products,
        categoryNames,
        isLoading,
        errorMessage,
        successMessage,
        productToDeactivate,
        isDeactivating,
        reactivatingProductId,
        loadData,
        requestDeactivate,
        cancelDeactivate,
        deactivateProduct,
        reactivateProduct,
    } =
        useProductsManagement(
            isSuperAdmin,
        );

    return (
        <section className="management-page">
            <ManagementHeader
                eyebrow="Catálogo"
                title="Productos"
                description={
                    isSuperAdmin
                        ? "Supervisa el catálogo completo y recupera registros desactivados."
                        : "Administra la información visible en el catálogo público."
                }
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
                    description={
                        errorMessage
                    }
                    actionLabel="Reintentar"
                    onAction={() => {
                        void loadData();
                    }}
                />
            ) : products.length === 0 ? (
                <SectionState
                    title="No hay productos registrados"
                    description="Registra el primer producto para comenzar a completar el catálogo."
                />
            ) : (
                <ProductsTable
                    products={
                        products
                    }
                    categoryNames={
                        categoryNames
                    }
                    isSuperAdmin={
                        isSuperAdmin
                    }
                    reactivatingProductId={
                        reactivatingProductId
                    }
                    onDeactivate={
                        requestDeactivate
                    }
                    onReactivate={(
                        product,
                    ) => {
                        void reactivateProduct(
                            product,
                        );
                    }}
                />
            )}

            <ConfirmDialog
                isOpen={
                    productToDeactivate !==
                    null
                }
                title="Desactivar producto"
                description={`El producto “${productToDeactivate?.name ?? ""}” dejará de mostrarse en el catálogo.`}
                confirmLabel="Desactivar producto"
                isConfirming={
                    isDeactivating
                }
                onCancel={
                    cancelDeactivate
                }
                onConfirm={() => {
                    void deactivateProduct();
                }}
            />
        </section>
    );
}
