import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { PublicLayout } from "../../features/public-site/components/PublicLayout";

const HomePage = lazy(() =>
    import("../../features/public-site/pages/HomePage").then((module) => ({
        default: module.HomePage,
    })),
);

const AboutPage = lazy(() =>
    import("../../features/public-site/pages/AboutPage").then((module) => ({
        default: module.AboutPage,
    })),
);

const ServicesPage = lazy(() =>
    import("../../features/public-site/pages/ServicesPage").then((module) => ({
        default: module.ServicesPage,
    })),
);

const ContactPage = lazy(() =>
    import("../../features/public-site/pages/ContactPage").then((module) => ({
        default: module.ContactPage,
    })),
);

const LegalPage = lazy(() =>
    import("../../features/public-site/pages/LegalPage").then((module) => ({
        default: module.LegalPage,
    })),
);

const CatalogPage = lazy(() =>
    import("../../features/products/pages/PublicCatalogPage").then((module) => ({
        default: module.PublicCatalogPage,
    })),
);

const ProductDetailPage = lazy(() =>
    import("../../features/products/pages/PublicProductDetailPage").then((module) => ({
        default: module.PublicProductDetailPage,
    })),
);

const FavoritesPage = lazy(() =>
    import("../../features/favorites/pages/FavoritesPage").then((module) => ({
        default: module.FavoritesPage,
    })),
);

const QuotationPage = lazy(() =>
    import("../../features/quotation/pages/QuotationPage").then((module) => ({
        default: module.QuotationPage,
    })),
);

const SearchPage = lazy(() =>
    import("../../features/search/pages/TechnicalSearchPage").then((module) => ({
        default: module.TechnicalSearchPage,
    })),
);

const ToolsPage = lazy(() =>
    import("../../features/technical-tools/pages/TechnicalToolsPage").then((module) => ({
        default: module.TechnicalToolsPage,
    })),
);

const BlogPage = lazy(() =>
    import("../../features/blog/pages/BlogPage").then((module) => ({
        default: module.BlogPage,
    })),
);

const BlogPostPage = lazy(() =>
    import("../../features/blog/pages/BlogPostPage").then((module) => ({
        default: module.BlogPostPage,
    })),
);

export const publicRoutes: RouteObject = {
    element: <PublicLayout />,
    children: [
        { index: true, element: <HomePage /> },
        { path: "nosotros", element: <AboutPage /> },
        { path: "servicios", element: <ServicesPage /> },
        { path: "contacto", element: <ContactPage /> },
        { path: "privacidad", element: <LegalPage type="privacy" /> },
        { path: "terminos", element: <LegalPage type="terms" /> },
        { path: "reclamaciones", element: <LegalPage type="complaints" /> },
        { path: "productos", element: <CatalogPage /> },
        { path: "productos/:productId", element: <ProductDetailPage /> },
        { path: "favoritos", element: <FavoritesPage /> },
        { path: "cotizacion", element: <QuotationPage /> },
        { path: "buscar", element: <SearchPage /> },
        { path: "herramientas", element: <ToolsPage /> },
        { path: "blog", element: <BlogPage /> },
        { path: "blog/:slug", element: <BlogPostPage /> },
    ],
};
