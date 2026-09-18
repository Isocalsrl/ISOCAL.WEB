import { useId } from "react";
import { ProgressiveImage } from "../../../../shared/components/media/ProgressiveImage";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { FavoriteToggleButton } from "../../../favorites/components/FavoriteToggleButton";
import { resolveApiUrl } from "../../../../shared/api/apiUrl";
import { useAccessibleDialog } from "../../../../shared/hooks/useAccessibleDialog";
import { QuotationToggleButton } from "../../../quotation/components/QuotationToggleButton";
import { contactUrl } from "../../../public-site/data/company";
import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";
import type { PublicProduct } from "../../types/product.types";

interface ProductDetailModalProps {
    product: PublicProduct;

    categoryName: string;

    onClose: () => void;
}

export function ProductDetailModal({ product, categoryName, onClose }: ProductDetailModalProps) {
    const imageUrl = resolveApiUrl(product.imageUrl);
    const titleId = useId();

    const descriptionId = useId();

    const {dialogRef} = useAccessibleDialog<HTMLDivElement>({
        onClose,
    });

    return createPortal(
        <div
            className="public-site-shell product-modal-backdrop"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                ref={dialogRef}
                className="product-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
            >
                <div className="product-modal-media" aria-hidden="true">
                    {imageUrl ? (
                        <ProgressiveImage src={imageUrl} alt="" />
                    ) : (
                        <div className="product-modal-media-fallback">
                            <strong>ISOCAL</strong>
                            <span>Imagen pendiente</span>
                        </div>
                    )}
                    <div className="product-modal-media-meta">
                        <span>ISOCAL</span>
                        <strong>{String(product.id).padStart(2, "0")}</strong>
                    </div>
                </div>
                <div className="product-modal-content">
                    <button
                        className="product-modal-close"
                        type="button"
                        aria-label="Cerrar detalle del producto"
                        onClick={onClose}
                    >
                        <span aria-hidden="true" />

                        <span aria-hidden="true" />
                    </button>

                    <p className="product-modal-category">{categoryName}</p>

                    <h2 id={titleId}>{product.name}</h2>

                    <p
                        id={descriptionId}
                        className={
                            product.description
                                ? "product-modal-description"
                                : "product-modal-description product-modal-description-empty"
                        }
                    >
                        {product.description ??
                            "Consulta con ISOCAL la disponibilidad, el modelo y las condiciones aplicables."}
                    </p>

                    <div className="product-modal-footer">
                        <div>
                            <span>Consulta de producto</span>

                            <p>Revisa el producto o envía tu requerimiento al equipo comercial.</p>
                        </div>

                        <div className="product-modal-actions">
                            <FavoriteToggleButton
                                productId={product.id}
                                productName={product.name}
                                showText
                            />

                            <QuotationToggleButton
                                productId={product.id}
                                productName={product.name}
                                showText
                            />

                            <Link
                                className="product-modal-detail-link"
                                to={`/productos/${product.id}`}
                                onClick={onClose}
                            >
                                Ver producto
                                <CorporateIcon name="arrow" />
                            </Link>

                            <a
                                className="ui-button ui-button-primary"
                                href={contactUrl(product.name)}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Consultar por WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}
