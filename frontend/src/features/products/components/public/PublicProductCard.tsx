import { FavoriteToggleButton } from "../../../favorites/components/FavoriteToggleButton";
import { resolveApiUrl } from "../../../../shared/api/apiUrl";
import { QuotationToggleButton } from "../../../quotation/components/QuotationToggleButton";
import { ArrowIcon } from "../../../../shared/components/ui/ArrowIcon";
import { ProgressiveImage } from "../../../../shared/components/media/ProgressiveImage";
import type { PublicProduct } from "../../types/product.types";

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
    const imageUrl = resolveApiUrl(product.imageUrl);
    return (
        <article className="catalog-product-card">
            <FavoriteToggleButton
                className="catalog-product-favorite"
                productId={product.id}
                productName={product.name}
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
                <div className="catalog-product-image">
                    {imageUrl ? <ProgressiveImage src={imageUrl} alt="" loading="lazy" /> : <div className="catalog-product-image-fallback"><strong>ISOCAL</strong><span>Imagen pendiente</span></div>}

                    <span className="catalog-product-image-mark" aria-hidden="true">
                        CATÁLOGO
                    </span>
                </div>

                <div className="catalog-product-card-content">
                    <p className="catalog-product-category">
                        {categoryName}
                    </p>

                    <span
                        className="catalog-product-name"
                        role="heading"
                        aria-level={
                            3
                        }
                    >
                        {product.name}
                    </span>

                    {
                        product.description
                            ? (
                                <p className="catalog-product-description">
                                    {product.description}
                                </p>
                            )
                            : (
                                <p className="catalog-product-description catalog-product-description-empty">
                                    Consulta disponibilidad y modelo con ISOCAL.
                                </p>
                            )
                    }

                    <span className="catalog-product-link">
                        Ver producto

                        <ArrowIcon />
                    </span>
                </div>
            </button>

            <QuotationToggleButton
                className="catalog-product-quotation"
                productId={product.id}
                productName={product.name}
            />
        </article>
    );
}
