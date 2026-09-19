import { lazy } from "react";
import { type RouteObject } from "react-router-dom";
import { AdminLayout } from "../../features/admin/components/AdminLayout";
import { ProtectedRoute } from "../../features/auth/guards/ProtectedRoute";
import { PublicOnlyRoute } from "../../features/auth/guards/PublicOnlyRoute";
import { SuperAdminRoute } from "../../features/auth/guards/SuperAdminRoute";
import "../../features/blog/styles/admin.css";

const LoginPage = lazy(() =>
    import("../../features/auth/pages/LoginPage").then((module) => ({
        default: module.LoginPage,
    })),
);


const AdminDashboardPage = lazy(() =>
    import("../../features/admin/pages/AdminDashboardPage").then((module) => ({
        default: module.AdminDashboardPage,
    })),
);

const AdminUsersPage = lazy(() =>
    import("../../features/admin-users/pages/AdminUsersPage").then((module) => ({
        default: module.AdminUsersPage,
    })),
);

const LoginHistoryPage = lazy(() =>
    import("../../features/auth/pages/LoginHistoryPage").then((module) => ({
        default: module.LoginHistoryPage,
    })),
);

const ProductsPage = lazy(() =>
    import("../../features/products/pages/ProductsPage").then((module) => ({
        default: module.ProductsPage,
    })),
);

const ProductFormPage = lazy(() =>
    import("../../features/products/pages/ProductFormPage").then((module) => ({
        default: module.ProductFormPage,
    })),
);

const CategoriesPage = lazy(() =>
    import("../../features/categories/pages/CategoriesPage").then((module) => ({
        default: module.CategoriesPage,
    })),
);

const AdminBlogPage = lazy(() =>
    import("../../features/blog/pages/AdminBlogPage").then((module) => ({
        default: module.AdminBlogPage,
    })),
);

const BlogEditorPage = lazy(() =>
    import("../../features/blog/pages/BlogEditorPage").then((module) => ({
        default: module.BlogEditorPage,
    })),
);

export const adminRoutes: RouteObject[] = [
    {
        element: <PublicOnlyRoute />,
        children: [{ path: "/admin/login", element: <LoginPage /> }],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/admin",
                element: <AdminLayout />,
                children: [
                    { index: true, element: <AdminDashboardPage /> },
                    { path: "products", element: <ProductsPage /> },
                    { path: "products/new", element: <ProductFormPage /> },
                    { path: "products/:productId/edit", element: <ProductFormPage /> },
                    { path: "categories", element: <CategoriesPage /> },
                    { path: "blog", element: <AdminBlogPage /> },
                    { path: "blog/new", element: <BlogEditorPage /> },
                    { path: "blog/:postId/edit", element: <BlogEditorPage /> },
                    {
                        element: <SuperAdminRoute />,
                        children: [
                            { path: "admins", element: <AdminUsersPage /> },
                            { path: "access-history", element: <LoginHistoryPage /> },
                        ],
                    },
                ],
            },
        ],
    },
];
