import { Navigate, Outlet, useLocation } from "react-router-dom";
import { FullPageLoader } from "../../../shared/components/feedback/FullPageLoader";
import { AuthSessionError } from "../components/AuthSessionError";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute() {
    const {
        status,
    } = useAuth();

    const location =
        useLocation();

    if (status === "loading") {
        return (
            <FullPageLoader
                message="Verificando tu sesión..."
            />
        );
    }

    if (status === "error") {
        return (
            <AuthSessionError />
        );
    }

    if (status === "anonymous") {
        return (
            <Navigate
                to="/admin/login"
                replace
                state={{
                    from:
                        location.pathname,
                }}
            />
        );
    }

    return <Outlet />;
}
