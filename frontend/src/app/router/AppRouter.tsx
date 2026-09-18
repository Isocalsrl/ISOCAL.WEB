import { Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { adminRoutes } from "./adminRoutes";
import { FullPageLoader } from "../../shared/components/feedback/FullPageLoader";
import { publicRoutes } from "./publicRoutes";

const routes = [publicRoutes, ...adminRoutes, { path: '*', element: <Navigate to="/" replace /> }];

export function AppRouter() {
    const element = useRoutes(routes);
    return <Suspense fallback={<FullPageLoader message="Preparando la página…" />}>{element}</Suspense>;
}
