import {
    useCallback,
    useMemo,
    useState,
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
    toSlug,
} from "../../../shared/utils/toSlug";

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
    ProductDetailModal,
} from "../components/public/ProductDetailModal";

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

function parseRequestedProductId(
    value:
        string | null,
): number | null {
    if (!value) {
        return null;
    }

    const parsedValue =
        Number(
            value,
        );

    return Number.isInteger(
        parsedValue,
    ) &&
        parsedValue > 0
        ? parsedValue
        : null;
}

export function PublicCatalogPage() {
    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

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

    const requestedProductId =
        parseRequestedProductId(
            searchParams.get(
                "producto",
            ),
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

    const normalizedSearchTerm =
        toSlug(
            searchTerm,
        );

    const filteredProducts =
        useMemo(
            () =>
                products.filter(
                    (
                        product,
                    ) => {
                        if (
                            selectedCategory &&
                            product.categoryId !==
                                selectedCategory.id
                        ) {
                            return false;
                        }

                        if (
                            !normalizedSearchTerm
                        ) {
                            return true;
                        }

                        const categoryName =
                            product.categoryId ===
                            null
                                ? ""
                                : categoryNamesById.get(
                                      product.categoryId,
                                  ) ?? "";

                        return toSlug(
                            [
                                product.name,
                                product.description ??
                                    "",
                                categoryName,
                            ].join(
                                " ",
                            ),
                        ).includes(
                            normalizedSearchTerm,
                        );
                    },
                ),
            [
                products,
                selectedCategory,
                normalizedSearchTerm,
                categoryNamesById,
            ],
        );

    const selectedProduct =
        useMemo(
            () =>
                products.find(
                    (
                        product,
                    ) =>
                        product.id ===
                        requestedProductId,
                ) ?? null,
            [
                products,
                requestedProductId,
            ],
        );

    const selectedProductCategoryName =
        selectedProduct
            ?.categoryId ===
        null
            ? "Sin categoría"
            : categoryNamesById.get(
                  selectedProduct
                      ?.categoryId ??
                      -1,
              ) ??
              "Catálogo ISOCAL";

    function selectCategory(
        categorySlug:
            string | null,
    ): void {
        const nextSearchParams =
            new URLSearchParams(
                searchParams,
            );

        nextSearchParams.delete(
            "producto",
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

    const openProduct =
        useCallback(
            (
                productId:
                    number,
            ): void => {
                const nextSearchParams =
                    new URLSearchParams(
                        searchParams,
                    );

                nextSearchParams.set(
                    "producto",
                    String(
                        productId,
                    ),
                );

                setSearchParams(
                    nextSearchParams,
                );
            },
            [
                searchParams,
                setSearchParams,
            ],
        );

    const closeProduct =
        useCallback(
            (): void => {
                const nextSearchParams =
                    new URLSearchParams(
                        searchParams,
                    );

                nextSearchParams.delete(
                    "producto",
                );

                setSearchParams(
                    nextSearchParams,
                    {
                        replace:
                            true,
                    },
                );
            },
            [
                searchParams,
                setSearchParams,
            ],
        );

    const resultLabel =
        filteredProducts.length ===
        1
            ? "1 producto"
            : `${filteredProducts.length} productos`;

    const hasSearch =
        searchTerm
            .trim()
            .length >
        0;

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
                            Equipos e
                            insumos
                        </p>

                        <h1 id="products-hero-title">
                            Encuentra el
                            equipo que tu
                            operación
                            necesita.
                        </h1>

                        <p className="products-hero-description">
                            Explora por
                            categoría y
                            consulta cada
                            producto sin
                            perder tu lugar
                            en el catálogo.
                        </p>
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
                                {
                                    selectedCategory
                                        ? selectedCategory.name
                                        : "Todos los productos"
                                }
                            </h2>
                        </div>

                        <div className="catalog-heading-meta">
                            <strong>
                                {
                                    resultLabel
                                }
                            </strong>

                            <p>
                                {
                                    selectedCategory
                                        ?.description ??
                                    "Filtra por categoría o busca directamente por el nombre del equipo."
                                }
                            </p>
                        </div>
                    </div>

                    {
                        isLoading && (
                            <div className="catalog-state">
                                <SectionState
                                    title="Cargando catálogo"
                                    description="Estamos consultando los productos y categorías disponibles."
                                    isLoading
                                />
                            </div>
                        )
                    }

                    {
                        !isLoading &&
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
                        )
                    }

                    {
                        !isLoading &&
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

                                <div className="catalog-main">
                                    <div className="catalog-toolbar">
                                        <label className="catalog-search">
                                            <span className="catalog-search-label">
                                                Buscar
                                                producto
                                            </span>

                                            <span className="catalog-search-control">
                                                <input
                                                    className="catalog-search-input"
                                                    type="search"
                                                    value={
                                                        searchTerm
                                                    }
                                                    placeholder="Ej. termómetro, balanza o pH"
                                                    onChange={(
                                                        event,
                                                    ) => {
                                                        setSearchTerm(
                                                            event
                                                                .target
                                                                .value,
                                                        );
                                                    }}
                                                />

                                                {
                                                    hasSearch && (
                                                        <button
                                                            className="catalog-search-clear"
                                                            type="button"
                                                            aria-label="Limpiar búsqueda"
                                                            onClick={() => {
                                                                setSearchTerm(
                                                                    "",
                                                                );
                                                            }}
                                                        >
                                                            ×
                                                        </button>
                                                    )
                                                }
                                            </span>
                                        </label>

                                        <p
                                            className="catalog-result-count"
                                            aria-live="polite"
                                        >
                                            Mostrando{" "}

                                            <strong>
                                                {
                                                    resultLabel
                                                }
                                            </strong>
                                        </p>
                                    </div>

                                    <div id="catalog-results">
                                        {
                                            filteredProducts.length ===
                                            0
                                                ? (
                                                    <div className="catalog-empty-filter">
                                                        <h3>
                                                            {
                                                                hasSearch
                                                                    ? "No encontramos coincidencias"
                                                                    : "No hay productos en esta categoría"
                                                            }
                                                        </h3>

                                                        <p>
                                                            {
                                                                hasSearch
                                                                    ? "Prueba con un nombre más corto o limpia la búsqueda para volver a ver el catálogo."
                                                                    : "Actualmente no existen productos públicos disponibles dentro de esta categoría."
                                                            }
                                                        </p>

                                                        <button
                                                            className="ui-button ui-button-secondary"
                                                            type="button"
                                                            onClick={() => {
                                                                if (
                                                                    hasSearch
                                                                ) {
                                                                    setSearchTerm(
                                                                        "",
                                                                    );
                                                                } else {
                                                                    selectCategory(
                                                                        null,
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            {
                                                                hasSearch
                                                                    ? "Limpiar búsqueda"
                                                                    : "Ver todos los productos"
                                                            }
                                                        </button>
                                                    </div>
                                                )
                                                : (
                                                    <div className="catalog-products-grid">
                                                        {
                                                            filteredProducts.map(
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
                                                                        onOpen={
                                                                            openProduct
                                                                        }
                                                                    />
                                                                ),
                                                            )
                                                        }
                                                    </div>
                                                )
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </section>

            <ContactSection />

            {
                selectedProduct && (
                    <ProductDetailModal
                        product={
                            selectedProduct
                        }
                        categoryName={
                            selectedProductCategoryName
                        }
                        onClose={
                            closeProduct
                        }
                    />
                )
            }
        </main>
    );
}