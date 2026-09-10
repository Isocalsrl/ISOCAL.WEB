import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

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
    AdminLayout,
} from "../../features/admin/components/AdminLayout";

import {
    AdminLoginPage,
} from "../../features/auth/pages/AdminLoginPage";

import {
    LoginHistoryPage,
} from "../../features/auth/pages/LoginHistoryPage";

import {
    CategoriesPage,
} from "../../features/categories/pages/CategoriesPage";

import {
    ProductFormPage,
} from "../../features/products/pages/ProductFormPage";

import {
    ProductsPage,
} from "../../features/products/pages/ProductsPage";

import {
    PublicCatalogPage,
} from "../../pages/PublicCatalogPage";

export function AppRouter() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PublicCatalogPage />
                }
            />

            <Route
                element={
                    <PublicOnlyRoute />
                }
            >
                <Route
                    path="/admin/login"
                    element={
                        <AdminLoginPage />
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
