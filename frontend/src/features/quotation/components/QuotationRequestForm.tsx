import { Link } from "react-router-dom";
import { resolveApiUrl } from "../../../shared/api/apiUrl";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";
import { ProgressiveImage } from "../../../shared/components/media/ProgressiveImage";
import type { PublicProduct } from "../../products/types/product.types";
import { RequestForm } from "../../requests/components/RequestForm";
import { formText } from "../../requests/model/request.types";

export function QuotationRequestForm({
    products,
    onRemove,
    onSuccess,
}: {
    products: readonly PublicProduct[];
    onRemove: (id: number) => void;
    onSuccess: () => void;
}) {
    return (
        <RequestForm
            kind="quotation"
            onSuccess={onSuccess}
            readDetails={(data) => ({
                items: products.map((product) => ({
                    productId: product.id,
                    quantity: Number(formText(data, `quantity-${product.id}`)),
                    notes: formText(data, `item-${product.id}`),
                })),
            })}
        >
            {products.length > 0 ? (
                <div className="co-request-products">
                    <div className="co-request-products-head">
                        <div>
                            <span>Selección actual</span>
                            <h3>Equipos seleccionados</h3>
                        </div>
                        <strong aria-live="polite">
                            {products.length} {products.length === 1 ? "equipo" : "equipos"}
                        </strong>
                    </div>

                    {products.map((product) => (
                        <div className="co-request-product ix-content-enter" key={product.id}>
                            <Link
                                className="co-request-product-media"
                                to={`/productos/${product.id}?origen=cotizacion`}
                                aria-label={`Ver ${product.name}`}
                            >
                                {product.imageUrl ? (
                                    <ProgressiveImage src={resolveApiUrl(product.imageUrl) ?? undefined} alt="" loading="lazy" />
                                ) : (
                                    <span>ISOCAL</span>
                                )}
                            </Link>

                            <div className="co-request-product-main">
                                <Link className="co-request-product-name" to={`/productos/${product.id}?origen=cotizacion`}>
                                    {product.name}
                                </Link>
                                <label>
                                    Observaciones del equipo
                                    <input name={`item-${product.id}`} maxLength={500} placeholder="Modelo, rango u otra indicación" />
                                </label>
                            </div>

                            <label className="co-request-product-quantity">
                                Cantidad
                                <input type="number" name={`quantity-${product.id}`} defaultValue={1} min={1} max={999} required />
                            </label>

                            <button
                                className="co-request-product-remove"
                                type="button"
                                aria-label={`Quitar ${product.name}`}
                                title={`Quitar ${product.name}`}
                                onClick={() => onRemove(product.id)}
                            >
                                <CorporateIcon name="close" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="co-request-products-empty" role="status">
                    <div className="co-request-products-empty-icon" aria-hidden="true">
                        <CorporateIcon name="package" />
                    </div>
                    <div>
                        <strong>Tu lista de cotización está vacía.</strong>
                        <p>
                            Puedes agregar equipos desde el catálogo o enviar una solicitud abierta describiendo lo que necesitas en el campo de requerimiento.
                        </p>
                        <Link className="co-text-link" to="/productos">
                            Agregar equipos desde el catálogo →
                        </Link>
                    </div>
                </div>
            )}
        </RequestForm>
    );
}
