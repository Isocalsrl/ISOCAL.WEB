import {
    useMemo,
} from "react";

import {
    useSearchParams,
} from "react-router-dom";

import {
    SectionState,
} from "../../../shared/components/ui/SectionState";

import {
    PageSeo,
} from "../../../shared/seo/PageSeo";

import {
    ContactSection,
} from "../../public-site/components/ContactSection";

import {
    COMPANY,
} from "../../public-site/data/company";

import {
    CatalogCategoryFilter,
} from "../components/public/CatalogCategoryFilter";

import {
    PublicProductCard,
} from "../components/public/PublicProductCard";

import {
    usePublicCatalog,
} from "../hooks/usePublicCatalog";

const CATALOG_STRUCTURED_DATA = {
    "@context":
        "https://schema.org",

    "@type":
        "CollectionPage",

    name:
        "Catálogo de productos | ISOCAL",

    url:
        `${COMPANY.website}/productos`,

    description:
        "Catálogo público de equipos e insumos disponibles en ISOCAL.",
};

export function PublicCatalogPage() {
    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();

    const {
        products,
        categories,
        isLoading,
        errorMessage,
        reload,
    } =
        usePublicCatalog();

    const requestedCategorySlug =
        searchParams.get(
            "categoria",
        );

    const selectedCategory =
        useMemo(
            () =>
                categories.find(
                    (
                        category,
                    ) =>
                        category.slug ===
                        requestedCategorySlug,
                ) ?? null,
            [
                categories,
                requestedCategorySlug,
            ],
        );

    const filteredProducts =
        useMemo(
            () => {
                if (
                    !selectedCategory
                ) {
                    return products;
                }

                return products.filter(
                    (
                        product,
                    ) =>
                        product.categoryId ===
                        selectedCategory.id,
                );
            },
            [
                products,
                selectedCategory,
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

    function selectCategory(
        categorySlug:
            string | null,
    ): void {
        const nextSearchParams =
            new URLSearchParams(
                searchParams,
            );

        if (
            categorySlug
        ) {
            nextSearchParams.set(
                "categoria",
                categorySlug,
            );
        } else {
            nextSearchParams.delete(
                "categoria",
            );
        }

        setSearchParams(
            nextSearchParams,
        );
    }

    const resultLabel =
        filteredProducts.length ===
        1
            ? "1 producto"
            : `${filteredProducts.length} productos`;

    return (
        <main className="public-main">
            <PageSeo
                title="Catálogo de productos | ISOCAL"
                description="Explora el catálogo público de equipos e insumos de ISOCAL y consulta productos organizados por categorías según las necesidades de tu operación."
                canonicalPath="/productos"
                image="/images/products/hero-productos.webp"
                structuredData={
                    CATALOG_STRUCTURED_DATA
                }
            />

            <section
                className="products-hero"
                aria-labelledby="products-hero-title"
            >
                <img
                    className="products-hero-image"
                    src="/images/products/hero-productos.webp"
                    alt="Equipos e instrumentos de medición"
                    width="1920"
                    height="1000"
                    fetchPriority="high"
                    decoding="async"
                />

                <div
                    className="products-hero-overlay"
                    aria-hidden="true"
                />

                <div className="public-container products-hero-content">
                    <div className="products-hero-copy">
                        <p className="products-hero-kicker">
                            Productos ·
                            ISOCAL
                        </p>

                        <h1 id="products-hero-title">
                            Equipamiento para
                            medir con mayor
                            control.
                        </h1>

                        <p className="products-hero-description">
                            Explora los
                            productos
                            disponibles y
                            navega por
                            categorías para
                            encontrar
                            alternativas
                            relacionadas con
                            la necesidad
                            técnica de tu
                            operación.
                        </p>
                    </div>
                </div>
            </section>

            <section
                className="catalog-intro public-section"
                aria-labelledby="catalog-intro-title"
            >
                <div className="public-container catalog-intro-grid">
                    <div className="catalog-intro-copy">
                        <p className="eyebrow">
                            Equipos e insumos
                        </p>

                        <h2 id="catalog-intro-title">
                            Una consulta más
                            clara desde el
                            primer momento.
                        </h2>

                        <p>
                            Consulta el
                            catálogo completo
                            o filtra los
                            productos por
                            categoría. Cada
                            producto dispone
                            de una vista
                            individual para
                            facilitar la
                            consulta con el
                            equipo de ISOCAL.
                        </p>
                    </div>

                    <div className="catalog-intro-image">
                        <img
                            src="/images/products/catalogo-editorial.webp"
                            alt="Selección de equipos e instrumentos técnicos"
                            width="1400"
                            height="1000"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                </div>
            </section>

            <section
                id="catalogo"
                className="catalog-section"
                aria-labelledby="catalog-title"
            >
                <div className="public-container">
                    <div className="catalog-heading">
                        <div>
                            <p className="eyebrow">
                                Catálogo
                                disponible
                            </p>

                            <h2 id="catalog-title">
                                {selectedCategory
                                    ? selectedCategory.name
                                    : "Todos los productos"}
                            </h2>
                        </div>

                        <div className="catalog-heading-meta">
                            <strong>
                                {
                                    resultLabel
                                }
                            </strong>

                            <p>
                                {selectedCategory
                                    ?.description ??
                                    "Selecciona una categoría para reducir el catálogo a los productos relacionados con esa área."}
                            </p>
                        </div>
                    </div>

                    {isLoading && (
                        <div className="catalog-state">
                            <SectionState
                                title="Cargando catálogo"
                                description="Estamos consultando los productos y categorías disponibles."
                                isLoading
                            />
                        </div>
                    )}

                    {!isLoading &&
                        errorMessage && (
                            <div className="catalog-state">
                                <SectionState
                                    title="No pudimos cargar el catálogo"
                                    description={
                                        errorMessage
                                    }
                                    actionLabel="Intentar nuevamente"
                                    onAction={
                                        reload
                                    }
                                />
                            </div>
                        )}

                    {!isLoading &&
                        !errorMessage && (
                            <div className="catalog-layout">
                                <aside className="catalog-sidebar">
                                    <CatalogCategoryFilter
                                        categories={
                                            categories
                                        }
                                        products={
                                            products
                                        }
                                        selectedCategorySlug={
                                            selectedCategory
                                                ?.slug ??
                                            null
                                        }
                                        onSelectCategory={
                                            selectCategory
                                        }
                                    />
                                </aside>

                                <div
                                    id="catalog-results"
                                    className="catalog-results"
                                    aria-live="polite"
                                >
                                    {filteredProducts.length ===
                                    0 ? (
                                        <SectionState
                                            title="No hay productos en esta categoría"
                                            description="Actualmente no existen productos públicos disponibles dentro de esta categoría."
                                            actionLabel="Ver todos los productos"
                                            onAction={() =>
                                                selectCategory(
                                                    null,
                                                )
                                            }
                                        />
                                    ) : (
                                        <div className="catalog-products-grid">
                                            {filteredProducts.map(
                                                (
                                                    product,
                                                ) => (
                                                    <PublicProductCard
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
                                                        returnCategorySlug={
                                                            selectedCategory
                                                                ?.slug ??
                                                            null
                                                        }
                                                    />
                                                ),
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                </div>
            </section>

            <ContactSection />
        </main>
    );
}