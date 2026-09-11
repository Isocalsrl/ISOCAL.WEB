import {
    Link,
} from "react-router-dom";

import {
    SectionState,
} from "../../../../shared/components/ui/SectionState";

import type {
    PublicCategory,
} from "../../../categories/types/category.types";

import {
    contactUrl,
} from "../../../public-site/data/company";

import type {
    PublicProduct,
} from "../../types/product.types";

interface PublicProductDetailProps {
    product:
        PublicProduct | null;

    category:
        PublicCategory | null;

    isLoading:
        boolean;

    errorMessage:
        string | null;

    catalogReturnUrl:
        string;

    onGoToCatalog:
        () => void;
}

export function PublicProductDetail({
    product,
    category,
    isLoading,
    errorMessage,
    catalogReturnUrl,
    onGoToCatalog,
}: PublicProductDetailProps) {
    return (
        <section className="product-detail-page">
            <div className="public-container">
                <Link
                    className="product-detail-back"
                    to={
                        catalogReturnUrl
                    }
                >
                    <span
                        aria-hidden="true"
                    >
                        ←
                    </span>

                    Volver al catálogo
                </Link>

                {isLoading && (
                    <div className="product-detail-state">
                        <SectionState
                            title="Cargando producto"
                            description="Estamos consultando la información disponible."
                            isLoading
                        />
                    </div>
                )}

                {!isLoading &&
                    errorMessage && (
                        <div className="product-detail-state">
                            <SectionState
                                title="Producto no disponible"
                                description={
                                    errorMessage
                                }
                                actionLabel="Volver al catálogo"
                                onAction={
                                    onGoToCatalog
                                }
                            />
                        </div>
                    )}

                {!isLoading &&
                    !errorMessage &&
                    product && (
                        <div className="product-detail-layout">
                            <div className="product-detail-content">
                                <p className="eyebrow">
                                    Producto
                                </p>

                                <p className="product-detail-category">
                                    {category
                                        ?.name ??
                                        "Catálogo ISOCAL"}
                                </p>

                                <h1>
                                    {
                                        product.name
                                    }
                                </h1>

                                {product.description ? (
                                    <p className="product-detail-description">
                                        {
                                            product.description
                                        }
                                    </p>
                                ) : (
                                    <p className="product-detail-description product-detail-description-empty">
                                        Este
                                        producto
                                        todavía no
                                        cuenta con
                                        una
                                        descripción
                                        pública
                                        disponible.
                                    </p>
                                )}
                            </div>

                            <aside className="product-detail-contact">
                                <p className="product-detail-contact-label">
                                    Consulta
                                    técnica
                                </p>

                                <h2>
                                    ¿Necesitas
                                    información
                                    sobre este
                                    producto?
                                </h2>

                                <p>
                                    Comunícate
                                    directamente
                                    con ISOCAL
                                    para recibir
                                    orientación
                                    sobre
                                    disponibilidad
                                    y
                                    características
                                    aplicables a
                                    tu necesidad.
                                </p>

                                <a
                                    className="ui-button ui-button-primary"
                                    href={contactUrl(
                                        product.name,
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Consultar
                                    producto
                                </a>

                                {category && (
                                    <div className="product-detail-meta">
                                        <span>
                                            Categoría
                                        </span>

                                        <strong>
                                            {
                                                category.name
                                            }
                                        </strong>
                                    </div>
                                )}
                            </aside>
                        </div>
                    )}
            </div>
        </section>
    );
}
