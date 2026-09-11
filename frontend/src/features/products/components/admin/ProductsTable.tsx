import {
    ActionLink,
} from "../../../../shared/components/ui/ActionLink";

import { resolveApiUrl } from "../../../../shared/api/apiUrl";

import {
    Button,
} from "../../../../shared/components/ui/Button";

import {
    StatusBadge,
} from "../../../../shared/components/ui/StatusBadge";

import type {
    Product,
} from "../../types/product.types";

interface ProductsTableProps {
    products:
        readonly Product[];

    categoryNames:
        ReadonlyMap<
            number,
            string
        >;

    isSuperAdmin:
        boolean;

    reactivatingProductId:
        number | null;

    onDeactivate:
        (
            product:
                Product,
        ) => void;

    onReactivate:
        (
            product:
                Product,
        ) => void;
}

function formatDate(
    value:
        string,
): string {
    return new Intl.DateTimeFormat(
        "es-PE",
        {
            dateStyle:
                "medium",
            timeStyle:
                "short",
        },
    ).format(
        new Date(
            value,
        ),
    );
}

export function ProductsTable({
    products,
    categoryNames,
    isSuperAdmin,
    reactivatingProductId,
    onDeactivate,
    onReactivate,
}: ProductsTableProps) {
    return (
        <>
            <div className="management-summary">
                <p className="management-count">
                    <strong>
                        {products.length}
                    </strong>{" "}
                    {isSuperAdmin
                        ? "productos registrados"
                        : "productos activos"}
                </p>
            </div>

            <div className="data-panel">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            {isSuperAdmin && (
                                <th>Actualizado</th>
                            )}
                            <th>
                                <span className="sr-only">
                                    Acciones
                                </span>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map(
                            (
                                product,
                            ) => (
                                <tr
                                    key={
                                        product.id
                                    }
                                >
                                    <td>
                                        <div className="data-product-image">
                                            {resolveApiUrl(product.imageUrl) ? (
                                                <img src={resolveApiUrl(product.imageUrl) ?? undefined} alt="" loading="lazy" />
                                            ) : <span>Sin imagen</span>}
                                        </div>
                                    </td>
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
                                        <StatusBadge
                                            isActive={
                                                product.isActive
                                            }
                                        />
                                    </td>

                                    {isSuperAdmin && (
                                        <td>
                                            <span className="data-date">
                                                {formatDate(
                                                    product.updatedAt,
                                                )}
                                            </span>
                                        </td>
                                    )}

                                    <td>
                                        <div className="data-actions">
                                            <ActionLink
                                                to={`/admin/products/${product.id}/edit`}
                                                variant="secondary"
                                            >
                                                Editar
                                            </ActionLink>

                                            {product.isActive ? (
                                                <Button
                                                    type="button"
                                                    variant="danger"
                                                    onClick={() => {
                                                        onDeactivate(
                                                            product,
                                                        );
                                                    }}
                                                >
                                                    Desactivar
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    isLoading={
                                                        reactivatingProductId ===
                                                        product.id
                                                    }
                                                    loadingLabel="Reactivando..."
                                                    onClick={() => {
                                                        onReactivate(
                                                            product,
                                                        );
                                                    }}
                                                >
                                                    Reactivar
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ),
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
