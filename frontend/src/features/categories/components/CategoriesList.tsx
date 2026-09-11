import {
    Button,
} from "../../../shared/components/ui/Button";

import {
    StatusBadge,
} from "../../../shared/components/ui/StatusBadge";

import type {
    Category,
} from "../types/category.types";

interface CategoriesListProps {
    categories:
        readonly Category[];

    isSuperAdmin:
        boolean;

    reactivatingCategoryId:
        number | null;

    onEdit:
        (
            category:
                Category,
        ) => void;

    onDeactivate:
        (
            category:
                Category,
        ) => void;

    onReactivate:
        (
            category:
                Category,
        ) => void;
}

export function CategoriesList({
    categories,
    isSuperAdmin,
    reactivatingCategoryId,
    onEdit,
    onDeactivate,
    onReactivate,
}: CategoriesListProps) {
    return (
        <div className="data-panel">
            <div className="category-list-heading">
                <h2>
                    {isSuperAdmin
                        ? "Categorías registradas"
                        : "Categorías activas"}
                </h2>
                <span>
                    {categories.length}
                </span>
            </div>

            {categories.length === 0 ? (
                <div className="category-empty">
                    No hay categorías registradas.
                </div>
            ) : (
                <div className="category-list">
                    {categories.map(
                        (
                            category,
                        ) => (
                            <article
                                className="category-item"
                                key={
                                    category.id
                                }
                            >
                                <div>
                                    <strong>
                                        {category.name}
                                    </strong>
                                    <span>
                                        /{category.slug}
                                    </span>
                                    <p>
                                        {category.description ??
                                            "Sin descripción"}
                                    </p>

                                    <StatusBadge
                                        isActive={
                                            category.isActive
                                        }
                                        activeLabel="Activa"
                                        inactiveLabel="Inactiva"
                                    />
                                </div>

                                <div className="data-actions">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            onEdit(
                                                category,
                                            );
                                        }}
                                    >
                                        Editar
                                    </Button>

                                    {category.isActive ? (
                                        <Button
                                            type="button"
                                            variant="danger"
                                            onClick={() => {
                                                onDeactivate(
                                                    category,
                                                );
                                            }}
                                        >
                                            Desactivar
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            isLoading={
                                                reactivatingCategoryId ===
                                                category.id
                                            }
                                            loadingLabel="Reactivando..."
                                            onClick={() => {
                                                onReactivate(
                                                    category,
                                                );
                                            }}
                                        >
                                            Reactivar
                                        </Button>
                                    )}
                                </div>
                            </article>
                        ),
                    )}
                </div>
            )}
        </div>
    );
}
