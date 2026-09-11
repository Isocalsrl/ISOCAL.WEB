import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import {
    ApiError,
} from "../../../shared/api/httpClient";

import {
    SectionState,
} from "../../../shared/components/ui/SectionState";

import {
    PageSeo,
} from "../../../shared/seo/PageSeo";

import {
    getPublicCategory,
} from "../../categories/api/publicCategories.api";

import type {
    PublicCategory,
} from "../../categories/types/category.types";

import {
    ContactSection,
} from "../../public-site/components/ContactSection";

import {
    contactUrl,
} from "../../public-site/data/company";

import {
    getPublicProduct,
} from "../api/publicProducts.api";

import type {
    PublicProduct,
} from "../types/product.types";

interface PublicProductDetail {
    product:
        PublicProduct;

    category:
        PublicCategory | null;
}

async function fetchProductDetail(
    productId: number,
): Promise<PublicProductDetail> {
    const product =
        await getPublicProduct(
            productId,
        );

    if (
        product.categoryId ===
        null
    ) {
        return {
            product,
            category: null,
        };
    }

    try {
        const category =
            await getPublicCategory(
                product.categoryId,
            );

        return {
            product,
            category,
        };
    } catch {
        /*
         * La categoría es información auxiliar.
         * Si no puede obtenerse, la ficha del
         * producto sigue siendo utilizable.
         */
        return {
            product,
            category: null,
        };
    }
}

function parseProductId(
    value:
        string | undefined,
): number | null {
    if (!value) {
        return null;
    }

    const parsed =
        Number(value);

    if (
        !Number.isInteger(
            parsed,
        ) ||
        parsed <= 0
    ) {
        return null;
    }

    return parsed;
}

export function PublicProductDetailPage() {
    const {
        productId,
    } =
        useParams();

    const [
        searchParams,
    ] =
        useSearchParams();

    const navigate =
        useNavigate();

    const [
        product,
        setProduct,
    ] = useState<
        PublicProduct | null
    >(null);

    const [
        category,
        setCategory,
    ] = useState<
        PublicCategory | null
    >(null);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<
        string | null
    >(null);

    const returnCategory =
        searchParams.get(
            "categoria",
        );

    const catalogReturnUrl =
        returnCategory
            ? `/productos?categoria=${encodeURIComponent(
                  returnCategory,
              )}`
            : "/productos";

    useEffect(() => {
        let isActive =
            true;

        const parsedProductId =
            parseProductId(
                productId,
            );

        setProduct(null);
        setCategory(null);
        setErrorMessage(null);

        if (
            parsedProductId ===
            null
        ) {
            setErrorMessage(
                "El producto solicitado no es válido.",
            );

            setIsLoading(
                false,
            );

            return () => {
                isActive =
                    false;
            };
        }

        setIsLoading(true);

        void fetchProductDetail(
            parsedProductId,
        )
            .then(
                (
                    detail,
                ) => {
                    if (
                        !isActive
                    ) {
                        return;
                    }

                    setProduct(
                        detail.product,
                    );

                    setCategory(
                        detail.category,
                    );
                },
            )
            .catch(
                (
                    error:
                        unknown,
                ) => {
                    if (
                        !isActive
                    ) {
                        return;
                    }

                    setErrorMessage(
                        error instanceof
                            ApiError
                            ? error.message
                            : "No se pudo cargar el producto.",
                    );
                },
            )
            .finally(() => {
                if (
                    isActive
                ) {
                    setIsLoading(
                        false,
                    );
                }
            });

        return () => {
            isActive =
                false;
        };
    }, [
        productId,
    ]);

    const pageTitle =
        product
            ? `${product.name} | Productos ISOCAL`
            : "Producto | ISOCAL";

    const pageDescription =
        product?.description ??
        "Consulta información sobre productos y equipamiento disponible en ISOCAL.";

    return (
        <main className="public-main">
            <PageSeo
                title={
                    pageTitle
                }
                description={
                    pageDescription
                }
                canonicalPath={
                    product
                        ? `/productos/${product.id}`
                        : "/productos"
                }
                image="/images/products/catalogo-editorial.webp"
            />

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
                                    onAction={() =>
                                        navigate(
                                            "/productos",
                                        )
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

            {!isLoading &&
                !errorMessage &&
                product && (
                    <ContactSection />
                )}
        </main>
    );
}