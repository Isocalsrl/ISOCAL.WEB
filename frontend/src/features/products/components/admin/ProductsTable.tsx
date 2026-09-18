import { useMemo, useState } from "react";
import { resolveApiUrl } from "../../../../shared/api/apiUrl";
import { ActionLink } from "../../../../shared/components/ui/ActionLink";
import { Button } from "../../../../shared/components/ui/Button";
import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";
import { StatusBadge } from "../../../../shared/components/ui/StatusBadge";
import type { Product } from "../../types/product.types";

interface ProductsTableProps {
    products: readonly Product[];
    categoryNames: ReadonlyMap<number, string>;
    isSuperAdmin: boolean;
    reactivatingProductId: number | null;
    onDeactivate: (product: Product) => void;
    onReactivate: (product: Product) => void;
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}

export function ProductsTable({
    products,
    categoryNames,
    isSuperAdmin,
    reactivatingProductId,
    onDeactivate,
    onReactivate,
}: ProductsTableProps) {
    const [query, setQuery] = useState("");
    const [categoryId, setCategoryId] = useState("all");
    const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

    const categories = useMemo(() => {
        const ids = new Set<number>();
        for (const product of products) {
            if (product.categoryId) ids.add(product.categoryId);
        }
        return [...ids]
            .map((id) => ({ id, name: categoryNames.get(id) ?? `Categoría ${id}` }))
            .sort((left, right) => left.name.localeCompare(right.name, "es"));
    }, [categoryNames, products]);

    const normalizedQuery = query.trim().toLocaleLowerCase("es-PE");
    const visibleProducts = useMemo(() => products.filter((product) => {
        if (categoryId !== "all" && product.categoryId !== Number(categoryId)) return false;
        if (status === "active" && !product.isActive) return false;
        if (status === "inactive" && product.isActive) return false;
        if (!normalizedQuery) return true;

        const category = product.categoryId ? categoryNames.get(product.categoryId) ?? "" : "";
        return [product.name, product.slug, product.description ?? "", category]
            .some((value) => value.toLocaleLowerCase("es-PE").includes(normalizedQuery));
    }), [categoryId, categoryNames, normalizedQuery, products, status]);

    const hasFilters = Boolean(normalizedQuery || categoryId !== "all" || status !== "all");

    function clearFilters() {
        setQuery("");
        setCategoryId("all");
        setStatus("all");
    }

    return (
        <>
            <div className="management-summary admin-product-summary">
                <div>
                    <p className="management-count">
                        <strong>{visibleProducts.length}</strong> de {products.length} {isSuperAdmin ? "productos registrados" : "productos activos"}
                    </p>
                    <span className="management-summary-copy">Busca por nombre, categoría o estado sin salir del catálogo.</span>
                </div>
            </div>

            <div className="admin-product-filters" aria-label="Filtros de productos">
                <label className="admin-search-field">
                    <CorporateIcon name="search" />
                    <span className="sr-only">Buscar productos</span>
                    <input
                        type="search"
                        value={query}
                        placeholder="Buscar producto, slug o categoría…"
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </label>

                <label className="admin-filter-field">
                    <span className="sr-only">Filtrar por categoría</span>
                    <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
                        <option value="all">Todas las categorías</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </label>

                {isSuperAdmin && (
                    <label className="admin-filter-field">
                        <span className="sr-only">Filtrar por estado</span>
                        <select value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
                            <option value="all">Todos los estados</option>
                            <option value="active">Activos</option>
                            <option value="inactive">Inactivos</option>
                        </select>
                    </label>
                )}

                {hasFilters && (
                    <button className="admin-clear-filters" type="button" onClick={clearFilters}>
                        Limpiar filtros
                    </button>
                )}
            </div>

            {visibleProducts.length === 0 ? (
                <div className="admin-filter-empty" role="status">
                    <span className="admin-filter-empty-icon"><CorporateIcon name="search" /></span>
                    <strong>No encontramos productos con esos filtros.</strong>
                    <p>Prueba otro término o elimina algún filtro para volver a ver el catálogo.</p>
                    <button type="button" onClick={clearFilters}>Mostrar todos</button>
                </div>
            ) : (
                <div className="admin-product-grid">
                    {visibleProducts.map((product) => {
                        const imageUrl = resolveApiUrl(product.imageUrl);
                        const category = product.categoryId
                            ? categoryNames.get(product.categoryId) ?? "Sin categoría"
                            : "Sin categoría";

                        return (
                            <article className={`admin-product-card ${!product.isActive ? "admin-product-card-inactive" : ""}`} key={product.id}>
                                <div className="admin-product-card-media">
                                    {imageUrl ? (
                                        <img src={imageUrl} alt="" loading="lazy" />
                                    ) : (
                                        <div className="admin-product-card-placeholder">
                                            <CorporateIcon name="package" />
                                            <span>Sin imagen</span>
                                        </div>
                                    )}
                                    <div className="admin-product-card-status">
                                        <StatusBadge isActive={product.isActive} />
                                    </div>
                                </div>

                                <div className="admin-product-card-body">
                                    <div className="admin-product-card-meta">
                                        <span>{category}</span>
                                        <span>/{product.slug}</span>
                                    </div>
                                    <h2>{product.name}</h2>
                                    <p>{product.description ?? "Aún no se ha agregado una descripción para este producto."}</p>

                                    {isSuperAdmin && (
                                        <div className="admin-product-card-updated">
                                            <CorporateIcon name="clock" />
                                            <span>Actualizado {formatDate(product.updatedAt)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="admin-product-card-actions">
                                    <ActionLink to={`/admin/products/${product.id}/edit`} variant="secondary">
                                        Editar
                                    </ActionLink>
                                    {product.isActive ? (
                                        <Button type="button" variant="danger" onClick={() => onDeactivate(product)}>
                                            Desactivar
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            isLoading={reactivatingProductId === product.id}
                                            loadingLabel="Reactivando..."
                                            onClick={() => onReactivate(product)}
                                        >
                                            Reactivar
                                        </Button>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </>
    );
}
