import {
    Link,
} from "react-router-dom";

import type {
    PublicProduct,
} from "../../products/types/product.types";

import {
    QuotationToggleButton,
} from "./QuotationToggleButton";

interface QuotationProductItemProps {
    product:
        PublicProduct;

    categoryName:
        string;
}

export function QuotationProductItem({
    product,
    categoryName,
}: QuotationProductItemProps) {
    return (
        <article className="quotation-product-item">
            <div className="quotation-product-content">
                <p className="quotation-product-category">
                    {
                        categoryName
                    }
                </p>

                <h3>
                    {
                        product.name
                    }
                </h3>

                <p
                    className={
                        product.description
                            ? "quotation-product-description"
                            : "quotation-product-description quotation-product-description-empty"
                    }
                >
                    {
                        product.description ??
                        "Este producto todavía no cuenta con una descripción pública disponible."
                    }
                </p>
            </div>

            <div className="quotation-product-actions">
                <Link
                    className="quotation-product-detail-link"
                    to={`/productos/${product.id}?origen=cotizacion`}
                >
                    Ver producto

                    <span
                        aria-hidden="true"
                    >
                        →
                    </span>
                </Link>

                <QuotationToggleButton
                    className="quotation-product-remove"
                    productId={
                        product.id
                    }
                    productName={
                        product.name
                    }
                    activeLabel="Quitar de cotización"
                />
            </div>
        </article>
    );
}