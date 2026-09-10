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
    AdminDashboardPage,
} from "../../features/auth/pages/AdminDashboardPage";

import {
    AdminLoginPage,
} from "../../features/auth/pages/AdminLoginPage";

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
                        <AdminDashboardPage />
                    }
                />
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
