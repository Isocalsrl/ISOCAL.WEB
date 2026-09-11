import {
    PageSeo,
} from "../../../shared/seo/PageSeo";

import {
    ContactSection,
} from "../../public-site/components/ContactSection";

import {
    PublicProductDetail,
} from "../components/public/PublicProductDetail";

import {
    usePublicProductDetail,
} from "../hooks/usePublicProductDetail";

export function PublicProductDetailPage() {
    const {
        product,
        category,
        isLoading,
        errorMessage,
        returnUrl,
        returnLabel,
        goToReturnPage,
    } =
        usePublicProductDetail();

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

            <PublicProductDetail
                product={
                    product
                }
                category={
                    category
                }
                isLoading={
                    isLoading
                }
                errorMessage={
                    errorMessage
                }
                returnUrl={
                    returnUrl
                }
                returnLabel={
                    returnLabel
                }
                onGoToReturnPage={
                    goToReturnPage
                }
            />

            {!isLoading &&
                !errorMessage &&
                product && (
                    <ContactSection />
                )}
        </main>
    );
}