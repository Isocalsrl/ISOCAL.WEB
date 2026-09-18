import type { PublicCategory } from "../../../../categories/types/category.types";

interface CatalogHeadingProps {
    selectedCategory: PublicCategory | null;
    resultLabel: string;
}

export function CatalogHeading({ selectedCategory, resultLabel }: CatalogHeadingProps) {
    return (
        <div className="catalog-heading">
            <div className="catalog-heading-intro">
                <p className="eyebrow">Catálogo</p>
                <h2 id="catalog-title">{selectedCategory ? selectedCategory.name : "Todos los productos"}</h2>
            </div>
            <div className="catalog-heading-meta">
                <strong className="catalog-heading-count">{resultLabel}</strong>
                <p>{selectedCategory?.description ?? "Filtra por categoría o busca por equipo, marca o término técnico."}</p>
            </div>
        </div>
    );
}
