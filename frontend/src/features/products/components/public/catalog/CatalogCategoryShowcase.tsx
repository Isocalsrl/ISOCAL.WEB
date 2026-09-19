import type { PublicCategory } from "../../../../categories/types/category.types";
import type { PublicProduct } from "../../../types/product.types";

interface CatalogCategoryShowcaseProps {
    products: readonly PublicProduct[];
    categories: readonly PublicCategory[];
    selectedCategory: PublicCategory | null;
    onSelectCategory: (categorySlug: string | null) => void;
}

export function CatalogCategoryShowcase({ products, categories, selectedCategory, onSelectCategory }: CatalogCategoryShowcaseProps) {
    return (
        <div className="catalog-category-showcase" aria-label="Accesos rápidos por categoría">
            <button
                type="button"
                className={!selectedCategory ? "catalog-category-showcase-card is-active" : "catalog-category-showcase-card"}
                aria-pressed={!selectedCategory}
                aria-controls="catalog-results"
                onClick={() => onSelectCategory(null)}
            >
                <span>00</span>
                <strong>Todos</strong>
                <small>{products.length} productos</small>
            </button>
            {categories.slice(0, 6).map((category, index) => {
                const count = products.filter((product) => product.categoryId === category.id).length;
                const active = selectedCategory?.id === category.id;
                return (
                    <button
                        type="button"
                        key={category.id}
                        className={active ? "catalog-category-showcase-card is-active" : "catalog-category-showcase-card"}
                        aria-pressed={active}
                        aria-controls="catalog-results"
                        onClick={() => onSelectCategory(category.slug)}
                    >
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{category.name}</strong>
                        <small>{count} producto{count === 1 ? "" : "s"}</small>
                    </button>
                );
            })}
        </div>
    );
}
