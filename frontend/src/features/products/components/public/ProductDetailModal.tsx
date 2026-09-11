import {
    useId,
} from "react";

import {
    createPortal,
} from "react-dom";

import {
    FavoriteToggleButton,
} from "../../../favorites/components/FavoriteToggleButton";

import { resolveApiUrl } from "../../../../shared/api/apiUrl";

import {
    useAccessibleDialog,
} from "../../../../shared/hooks/useAccessibleDialog";

import {
    QuotationToggleButton,
} from "../../../quotation/components/QuotationToggleButton";

import {
    contactUrl,
} from "../../../public-site/data/company";

import type {
    PublicProduct,
} from "../../types/product.types";

interface ProductDetailModalProps {
    product:
        PublicProduct;

    categoryName:
        string;

    onClose:
        () => void;
}

export function ProductDetailModal({
    product,
    categoryName,
    onClose,
}: ProductDetailModalProps) {
    const imageUrl = resolveApiUrl(product.imageUrl);
    const titleId =
        useId();

    const descriptionId =
        useId();

    const { dialogRef } =
        useAccessibleDialog<HTMLDivElement>({
            onClose,
        });

    return createPortal(
        <div
            className="product-modal-backdrop"
            onMouseDown={(
                event,
            ) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div
                ref={dialogRef}
                className="product-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby={
                    titleId
                }
                aria-describedby={
                    descriptionId
                }
            >
                <div className="product-modal-media" aria-hidden="true">
                    {imageUrl ? <img src={imageUrl} alt="" /> : <div className="product-modal-media-fallback"><strong>ISOCAL</strong><span>Imagen pendiente</span></div>}
                    <div className="product-modal-media-meta"><span>ISOCAL</span><strong>{String(product.id).padStart(2, "0")}</strong></div>
                </div>
                <div className="product-modal-content">
                    <button
                        className="product-modal-close"
                        type="button"
                        aria-label="Cerrar detalle del producto"
                        onClick={
                            onClose
                        }
                    >
                        <span
                            aria-hidden="true"
                        />

                        <span
                            aria-hidden="true"
                        />
                    </button>

                    <p className="product-modal-category">
                        {
                            categoryName
                        }
                    </p>

                    <h2
                        id={
                            titleId
                        }
                    >
                        {
                            product.name
                        }
                    </h2>

                    <p
                        id={
                            descriptionId
                        }
                        className={
                            product.description
                                ? "product-modal-description"
                                : "product-modal-description product-modal-description-empty"
                        }
                    >
                        {
                            product.description ??
                            "Este producto todavía no cuenta con una descripción pública. Puedes consultar directamente con ISOCAL para conocer sus características y disponibilidad."
                        }
                    </p>

                    <div className="product-modal-footer">
                        <div>
                            <span>
                                Atención
                                técnica
                            </span>

                            <p>
                                Consulta
                                disponibilidad
                                y
                                características
                                para tu
                                operación.
                            </p>
                        </div>

                        <div className="product-modal-actions">
                            <FavoriteToggleButton
                                productId={
                                    product.id
                                }
                                productName={
                                    product.name
                                }
                                showText
                            />

                            <QuotationToggleButton
                                productId={
                                    product.id
                                }
                                productName={
                                    product.name
                                }
                            />

                            <a
                                className="ui-button ui-button-primary"
                                href={
                                    contactUrl(
                                        product.name,
                                    )
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Consultar
                                producto
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}
