import { Link } from "react-router-dom";
import { ProgressiveImage } from "../../../../shared/components/media/ProgressiveImage";
import { resolveApiUrl } from "../../../../shared/api/apiUrl";
import { ProductDetailSkeleton, PublicStatePanel } from "../../../../shared/components/feedback";
import type { PublicCategory } from "../../../categories/types/category.types";
import { FavoriteToggleButton } from "../../../favorites/components/FavoriteToggleButton";
import { contactUrl } from "../../../public-site/data/company";
import { QuotationToggleButton } from "../../../quotation/components/QuotationToggleButton";
import type { ProductDetailErrorKind } from "../../hooks/usePublicProductDetail";
import type { PublicProduct } from "../../types/product.types";
import { RelatedProductsSection } from "./RelatedProductsSection";

interface PublicProductDetailProps {
    product: PublicProduct | null;
    category: PublicCategory | null;
    relatedProducts: readonly PublicProduct[];
    isLoading: boolean;
    errorMessage: string | null;
    errorKind: ProductDetailErrorKind | null;
    onReload: () => void;
    returnUrl: string;
    returnLabel: string;
    onGoToReturnPage: () => void;
}

export function PublicProductDetail({
    product,
    category,
    relatedProducts,
    isLoading,
    errorMessage,
    errorKind,
    onReload,
    returnUrl,
    returnLabel,
    onGoToReturnPage,
}: PublicProductDetailProps) {
    const imageUrl = resolveApiUrl(product?.imageUrl);

    return (
        <section className="product-detail-page">
            <div className="public-container">
                <Link className="product-detail-back" to={returnUrl}>
                    <span aria-hidden="true">←</span>
                    {returnLabel}
                </Link>

                {isLoading ? (
                    <div className="product-detail-state">
                        <ProductDetailSkeleton />
                    </div>
                ) : null}

                {!isLoading && errorMessage ? (
                    <div className="product-detail-state">
                        <PublicStatePanel
                            variant={
                                errorKind === "network"
                                    ? "network"
                                    : errorKind === "not-found"
                                      ? "not-found"
                                      : "error"
                            }
                            eyebrow={
                                errorKind === "not-found"
                                    ? "Producto no encontrado"
                                    : errorKind === "network"
                                      ? "Sin conexión"
                                      : "Producto no disponible"
                            }
                            title={
                                errorKind === "not-found"
                                    ? "No encontramos este producto"
                                    : errorKind === "network"
                                      ? "No pudimos cargar el producto"
                                      : "Este producto no está disponible ahora"
                            }
                            description={errorMessage}
                            primaryAction={
                                errorKind === "not-found"
                                    ? { label: "Ver catálogo", to: "/productos" }
                                    : { label: "Volver a intentar", onClick: onReload }
                            }
                            secondaryAction={{ label: returnLabel, onClick: onGoToReturnPage }}
                        />
                    </div>
                ) : null}

                {!isLoading && !errorMessage && !product ? (
                    <div className="product-detail-state">
                        <PublicStatePanel
                            variant="not-found"
                            eyebrow="Producto no encontrado"
                            title="No encontramos este producto"
                            description="Puede haber sido retirado del catálogo o la dirección ya no está disponible."
                            primaryAction={{ label: "Ver catálogo", to: "/productos" }}
                        />
                    </div>
                ) : null}

                {!isLoading && !errorMessage && product ? (
                    <div className="product-detail-layout ix-content-enter">
                        <div className="product-detail-content">
                            <div className="product-detail-image">
                                {imageUrl ? (
                                    <ProgressiveImage src={imageUrl} alt={`Imagen de ${product.name}`} />
                                ) : (
                                    <div className="product-detail-image-fallback">
                                        <strong>ISOCAL</strong>
                                        <span>Imagen pendiente</span>
                                    </div>
                                )}
                            </div>

                            <p className="eyebrow">Producto</p>
                            <p className="product-detail-category">{category?.name ?? "Catálogo ISOCAL"}</p>
                            <h1>{product.name}</h1>

                            {product.description ? (
                                <p className="product-detail-description">{product.description}</p>
                            ) : (
                                <p className="product-detail-description product-detail-description-empty">
                                    Consulta con ISOCAL la disponibilidad, el modelo y las condiciones aplicables.
                                </p>
                            )}
                        </div>

                        <aside className="product-detail-contact">
                            <p className="product-detail-contact-label">Consulta de producto</p>
                            <h2>Consulta disponibilidad y características.</h2>
                            <p>
                                Indica el producto y tu requerimiento para que el equipo comercial pueda responderte.
                            </p>

                            <div className="product-detail-actions">
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

                                <Link className="co-text-link" to="/cotizacion">
                                    Solicitar cotización →
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

                            {category ? (
                                <div className="product-detail-meta">
                                    <span>Categoría</span>
                                    <strong>{category.name}</strong>
                                </div>
                            ) : null}
                        </aside>
                    </div>
                ) : null}

                {!isLoading && !errorMessage && product ? (
                    <RelatedProductsSection products={relatedProducts} category={category} />
                ) : null}
            </div>
        </section>
    );
}
