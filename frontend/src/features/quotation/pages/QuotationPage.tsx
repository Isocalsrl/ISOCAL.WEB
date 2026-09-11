import {
    useEffect,
    useMemo,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    SectionState,
} from "../../../shared/components/ui/SectionState";

import {
    PageSeo,
} from "../../../shared/seo/PageSeo";

import {
    usePublicCatalog,
} from "../../products/hooks/usePublicCatalog";

import {
    QuotationProductItem,
} from "../components/QuotationProductItem";

import {
    QuotationSummary,
} from "../components/QuotationSummary";

import {
    useQuotation,
} from "../hooks/useQuotation";

export function QuotationPage() {
    const {
        quotationProductIds,
        quotationCount,
        clearQuotation,
        retainAvailableQuotationProducts,
    } = useQuotation();

    const {
        products,
        categories,
        isLoading,
        errorMessage,
        reload,
    } = usePublicCatalog();

    const quotationProductIdSet =
        useMemo(
            () =>
                new Set(
                    quotationProductIds,
                ),
            [
                quotationProductIds,
            ],
        );

    const quotationProducts =
        useMemo(
            () =>
                products.filter(
                    (
                        product,
                    ) =>
                        quotationProductIdSet.has(
                            product.id,
                        ),
                ),
            [
                products,
                quotationProductIdSet,
            ],
        );

    const categoryNamesById =
        useMemo(
            () =>
                new Map(
                    categories.map(
                        (
                            category,
                        ) => [
                            category.id,
                            category.name,
                        ],
                    ),
                ),
            [
                categories,
            ],
        );

    const availableProductIds =
        useMemo(
            () =>
                products.map(
                    (
                        product,
                    ) =>
                        product.id,
                ),
            [
                products,
            ],
        );

    useEffect(() => {
        if (
            isLoading ||
            errorMessage ||
            quotationCount ===
                0
        ) {
            return;
        }

        let isActive =
            true;

        queueMicrotask(() => {
            if (!isActive) {
                return;
            }

            retainAvailableQuotationProducts(
                availableProductIds,
            );
        });

        return () => {
            isActive =
                false;
        };
    }, [
        availableProductIds,
        errorMessage,
        isLoading,
        quotationCount,
        retainAvailableQuotationProducts,
    ]);

    return (
        <main className="public-main quotation-page">
            <PageSeo
                title="Cotización | ISOCAL"
                description="Organiza los productos del catálogo de ISOCAL que deseas incluir en una futura solicitud de cotización."
                canonicalPath="/cotizacion"
            />

            <section className="quotation-hero">
                <div className="public-container quotation-hero-content">
                    <div>
                        <p className="eyebrow">
                            Selección técnica
                        </p>

                        <h1>
                            Prepara tu cotización.
                        </h1>
                    </div>

                    <p className="quotation-hero-description">
                        Agrupa los equipos e insumos que deseas consultar y revisa tu selección antes de enviar una futura solicitud a ISOCAL.
                    </p>
                </div>
            </section>

            <section
                className="quotation-section"
                aria-labelledby="quotation-title"
            >
                <div className="public-container">
                    <div className="quotation-heading">
                        <div>
                            <p className="eyebrow">
                                Cotización
                            </p>

                            <h2 id="quotation-title">
                                Productos seleccionados
                            </h2>
                        </div>

                        <p
                            className="quotation-count"
                            aria-live="polite"
                        >
                            <strong>
                                {
                                    quotationCount
                                }
                            </strong>{" "}

                            {quotationCount ===
                            1
                                ? "producto seleccionado"
                                : "productos seleccionados"}
                        </p>
                    </div>

                    {quotationCount ===
                    0 ? (
                        <div className="quotation-empty">
                            <h3>
                                Tu lista de cotización está vacía.
                            </h3>

                            <p>
                                Explora el catálogo y agrega los productos sobre los que deseas solicitar información comercial.
                            </p>

                            <Link
                                className="ui-button ui-button-primary"
                                to="/productos"
                            >
                                Explorar catálogo
                            </Link>
                        </div>
                    ) : isLoading ? (
                        <div className="quotation-state">
                            <SectionState
                                title="Cargando cotización"
                                description="Estamos consultando la información actual de los productos seleccionados."
                                isLoading
                            />
                        </div>
                    ) : errorMessage ? (
                        <div className="quotation-state">
                            <SectionState
                                title="No pudimos cargar la cotización"
                                description={
                                    errorMessage
                                }
                                actionLabel="Intentar nuevamente"
                                onAction={
                                    reload
                                }
                            />
                        </div>
                    ) : quotationProducts.length ===
                      0 ? (
                        <div className="quotation-state">
                            <SectionState
                                title="Actualizando cotización"
                                description="Estamos verificando la disponibilidad de los productos seleccionados."
                                isLoading
                            />
                        </div>
                    ) : (
                        <div className="quotation-layout">
                            <div
                                className="quotation-products-list"
                                aria-label="Productos seleccionados para cotización"
                            >
                                {quotationProducts.map(
                                    (
                                        product,
                                    ) => (
                                        <QuotationProductItem
                                            key={
                                                product.id
                                            }
                                            product={
                                                product
                                            }
                                            categoryName={
                                                product.categoryId ===
                                                null
                                                    ? "Sin categoría"
                                                    : categoryNamesById.get(
                                                          product.categoryId,
                                                      ) ??
                                                      "Categoría"
                                            }
                                        />
                                    ),
                                )}
                            </div>

                            <QuotationSummary
                                productCount={
                                    quotationProducts.length
                                }
                                onClear={
                                    clearQuotation
                                }
                            />
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}