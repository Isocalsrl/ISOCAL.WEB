import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import {
    AdminLayout,
} from "../../features/admin/components/AdminLayout";

import {
    ProtectedRoute,
} from "../../features/auth/guards/ProtectedRoute";

import {
    PublicOnlyRoute,
} from "../../features/auth/guards/PublicOnlyRoute";

import {
    SuperAdminRoute,
} from "../../features/auth/guards/SuperAdminRoute";

import {
    LoginHistoryPage,
} from "../../features/auth/pages/LoginHistoryPage";

import {
    LoginPage,
} from "../../features/auth/pages/LoginPage";

import {
    CategoriesPage,
} from "../../features/categories/pages/CategoriesPage";

import {
    QuoteDetailPage,
} from "../../features/quotes/pages/QuoteDetailPage";

import {
    QuotesPage,
} from "../../features/quotes/pages/QuotesPage";

import {
    FavoritesPage,
} from "../../features/favorites/pages/FavoritesPage";

import {
    ProductFormPage,
} from "../../features/products/pages/ProductFormPage";

import {
    ProductsPage,
} from "../../features/products/pages/ProductsPage";

import {
    PublicCatalogPage,
} from "../../features/products/pages/PublicCatalogPage";

import {
    PublicProductDetailPage,
} from "../../features/products/pages/PublicProductDetailPage";

import {
    PublicLayout,
} from "../../features/public-site/components/PublicLayout";

import {
    AboutPage,
} from "../../features/public-site/pages/AboutPage";

import {
    HomePage,
} from "../../features/public-site/pages/HomePage";

import {
    ServicesPage,
} from "../../features/public-site/pages/ServicesPage";

import {
    QuotationPage,
} from "../../features/quotation/pages/QuotationPage";

export function AppRouter() {
    return (
        <Routes>
            <Route
                element={
                    <PublicLayout />
                }
            >
                <Route
                    index
                    element={
                        <HomePage />
                    }
                />

                <Route
                    path="nosotros"
                    element={
                        <AboutPage />
                    }
                />

                <Route
                    path="servicios"
                    element={
                        <ServicesPage />
                    }
                />

                <Route
                    path="productos"
                    element={
                        <PublicCatalogPage />
                    }
                />

                <Route
                    path="productos/:productId"
                    element={
                        <PublicProductDetailPage />
                    }
                />

                <Route
                    path="favoritos"
                    element={
                        <FavoritesPage />
                    }
                />

                <Route
                    path="cotizacion"
                    element={
                        <QuotationPage />
                    }
                />
            </Route>

            <Route
                element={
                    <PublicOnlyRoute />
                }
            >
                <Route
                    path="/admin/login"
                    element={
                        <LoginPage />
                    }
                />
            </Route>

            <Route
                element={
                    <ProtectedRoute />
                }
            >
                <Route
                    path="/admin"
                    element={
                        <AdminLayout />
                    }
                >
                    <Route
                        index
                        element={
                            <Navigate
                                to="products"
                                replace
                            />
                        }
                    />

                    <Route
                        path="products"
                        element={
                            <ProductsPage />
                        }
                    />

                    <Route
                        path="products/new"
                        element={
                            <ProductFormPage />
                        }
                    />

                    <Route
                        path="products/:productId/edit"
                        element={
                            <ProductFormPage />
                        }
                    />

                    <Route
                        path="categories"
                        element={
                            <CategoriesPage />
                        }
                    />

                    <Route
                        path="quotes"
                        element={
                            <QuotesPage />
                        }
                    />

                    <Route
                        path="quotes/:quoteId"
                        element={
                            <QuoteDetailPage />
                        }
                    />

                    <Route
                        element={
                            <SuperAdminRoute />
                        }
                    >
                        <Route
                            path="access-history"
                            element={
                                <LoginHistoryPage />
                            }
                        />
                    </Route>
                </Route>
            </Route>

            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />
        </Routes>
    );
}
