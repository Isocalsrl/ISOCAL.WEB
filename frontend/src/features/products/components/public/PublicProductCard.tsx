import {
    FavoriteToggleButton,
} from "../../../favorites/components/FavoriteToggleButton";

import {
    QuotationToggleButton,
} from "../../../quotation/components/QuotationToggleButton";

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

    onOpen:
        (
            productId:
                number,
        ) => void;

    opensDialog?:
        boolean;
}

export function PublicProductCard({
    product,
    categoryName,
    onOpen,
    opensDialog = true,
}: PublicProductCardProps) {
    return (
        <article className="catalog-product-card">
            <FavoriteToggleButton
                className="catalog-product-favorite"
                productId={
                    product.id
                }
                productName={
                    product.name
                }
            />

            <button
                className="catalog-product-card-button"
                type="button"
                aria-haspopup={
                    opensDialog
                        ? "dialog"
                        : undefined
                }
                aria-label={`Abrir información de ${product.name}`}
                onClick={() => {
                    onOpen(
                        product.id,
                    );
                }}
            >
                <p className="catalog-product-category">
                    {
                        categoryName
                    }
                </p>

                <span
                    className="catalog-product-name"
                    role="heading"
                    aria-level={
                        3
                    }
                >
                    {
                        product.name
                    }
                </span>

                {
                    product.description
                        ? (
                            <p className="catalog-product-description">
                                {
                                    product.description
                                }
                            </p>
                        )
                        : (
                            <p className="catalog-product-description catalog-product-description-empty">
                                Sin
                                descripción
                                pública
                                disponible.
                            </p>
                        )
                }

                <span className="catalog-product-link">
                    Ver información

                    <ArrowIcon />
                </span>
            </button>

            <QuotationToggleButton
                className="catalog-product-quotation"
                productId={
                    product.id
                }
                productName={
                    product.name
                }
            />
        </article>
    );
}