import { PageSeo } from "../../../shared/seo/PageSeo";
import { ContactSection } from "../../public-site/components/ContactSection";
import { COMPANY } from "../../public-site/data/company";
import { ProductDetailModal } from "../components/public/ProductDetailModal";
import { CatalogHeroSection } from "../components/public/catalog/CatalogHeroSection";
import { CatalogSection } from "../components/public/catalog/CatalogSection";
import { useCatalogView } from "../hooks/useCatalogView";
import { usePublicCatalog } from "../hooks/usePublicCatalog";

const CATALOG_STRUCTURED_DATA = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Catálogo de productos | ISOCAL",
    url: `${COMPANY.website}/productos`,
    description: "Catálogo público de equipos e insumos disponibles en ISOCAL.",
};

export function PublicCatalogPage() {
    const {
        products,
        categories,
        isLoading,
        errorMessage,
        errorKind,
        reload,
    } = usePublicCatalog();

    const {
        searchTerm,
        setSearchTerm,
        selectedCategory,
        selectedProduct,
        selectedProductCategoryName,
        categoryNamesById,
        filteredProducts,
        resultLabel,
        hasSearch,
        selectCategory,
        openProduct,
        closeProduct,
    } = useCatalogView(products, categories);

    return (
        <main className="public-main">
            <PageSeo
                title="Catálogo de productos | ISOCAL"
                description="Explora el catálogo público de equipos e insumos de ISOCAL y consulta productos organizados por categorías según las necesidades de tu operación."
                canonicalPath="/productos"
                image="/images/products/hero-productos.webp"
                structuredData={CATALOG_STRUCTURED_DATA}
            />

            <CatalogHeroSection
                productCount={products.length}
                categoryCount={categories.length}
                isLoading={isLoading}
            />

            <CatalogSection
                products={products}
                categories={categories}
                filteredProducts={filteredProducts}
                selectedCategory={selectedCategory}
                categoryNamesById={categoryNamesById}
                searchTerm={searchTerm}
                resultLabel={resultLabel}
                hasSearch={hasSearch}
                isLoading={isLoading}
                errorMessage={errorMessage}
                errorKind={errorKind}
                onReload={reload}
                onSelectCategory={selectCategory}
                onSearchChange={setSearchTerm}
                onOpenProduct={openProduct}
            />

            <ContactSection />

            {selectedProduct && (
                <ProductDetailModal
                    product={selectedProduct}
                    categoryName={selectedProductCategoryName}
                    onClose={closeProduct}
                />
            )}
        </main>
    );
}
