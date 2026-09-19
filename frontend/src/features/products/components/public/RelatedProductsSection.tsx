import { Link } from "react-router-dom";
import { ProgressiveImage } from "../../../../shared/components/media/ProgressiveImage";
import { resolveApiUrl } from "../../../../shared/api/apiUrl";
import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";
import type { PublicCategory } from "../../../categories/types/category.types";
import type { PublicProduct } from "../../types/product.types";

interface RelatedProductsSectionProps {
    products: readonly PublicProduct[];
    category: PublicCategory | null;
}

export function RelatedProductsSection({ products, category }: RelatedProductsSectionProps) {
    if (products.length === 0) {
        return null;
    }

    const categoryQuery = category
        ? `?categoria=${encodeURIComponent(category.slug)}`
        : "";

    return (
        <section className="product-related" aria-labelledby="product-related-title">
            <div className="product-related-heading">
                <div>
                    <p className="eyebrow">Misma categoría</p>
                    <h2 id="product-related-title">Productos relacionados</h2>
                </div>

                {category ? (
                    <Link to={`/productos?categoria=${encodeURIComponent(category.slug)}`}>
                        Ver categoría {category.name}
                        <CorporateIcon name="arrow" />
                    </Link>
                ) : null}
            </div>

            <div className="product-related-grid">
                {products.map((product) => {
                    const imageUrl = resolveApiUrl(product.imageUrl);

                    return (
                        <Link
                            className="product-related-card"
                            key={product.id}
                            to={`/productos/${product.id}${categoryQuery}`}
                        >
                            <div className="product-related-media">
                                {imageUrl ? (
                                    <ProgressiveImage src={imageUrl} alt="" loading="lazy" />
                                ) : (
                                    <div className="product-related-fallback" aria-hidden="true">
                                        <strong>ISOCAL</strong>
                                        <span>Imagen pendiente</span>
                                    </div>
                                )}
                            </div>

                            <div className="product-related-copy">
                                <span>{category?.name ?? "Catálogo ISOCAL"}</span>
                                <h3>{product.name}</h3>
                                {product.description ? <p>{product.description}</p> : null}
                                <strong className="product-related-link">
                                    Ver producto
                                    <CorporateIcon name="arrow" />
                                </strong>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
