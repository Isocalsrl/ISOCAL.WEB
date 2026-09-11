import {
    Link,
} from "react-router-dom";

import {
    ArrowIcon,
} from "../../../../shared/components/ui/ArrowIcon";

import type {
    PublicProduct,
} from "../../types/product.types";

interface PublicProductCardProps {
    product:
        PublicProduct;

    categoryName:
        string;

    returnCategorySlug?:
        string | null;
}

export function PublicProductCard({
    product,
    categoryName,
    returnCategorySlug =
        null,
}: PublicProductCardProps) {
    const returnQuery =
        returnCategorySlug
            ? `?categoria=${encodeURIComponent(
                  returnCategorySlug,
              )}`
            : "";

    return (
        <article className="catalog-product-card">
            <div>
                <p className="catalog-product-category">
                    {categoryName}
                </p>

                <h3>
                    {product.name}
                </h3>

                {product.description ? (
                    <p className="catalog-product-description">
                        {
                            product.description
                        }
                    </p>
                ) : (
                    <p className="catalog-product-description catalog-product-description-empty">
                        Sin descripción
                        pública disponible.
                    </p>
                )}
            </div>

            <Link
                className="catalog-product-link"
                to={`/productos/${product.id}${returnQuery}`}
                aria-label={`Ver detalle de ${product.name}`}
            >
                Ver detalle

                <ArrowIcon />
            </Link>
        </article>
    );
}