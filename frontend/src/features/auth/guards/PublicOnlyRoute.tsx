import {
    Navigate,
    Outlet,
} from "react-router-dom";

import {
    FullPageLoader,
} from "../../../shared/components/feedback/FullPageLoader";

import {
    useAuth,
} from "../hooks/useAuth";

export function PublicOnlyRoute() {
    const {
        status,
    } = useAuth();

    if (status === "loading") {
        return (
            <FullPageLoader
                message="Verificando tu sesión..."
            />
        );
    }

    if (
        status ===
        "authenticated"
    ) {
        return (
            <Navigate
                to="/admin"
                replace
            />
        );
    }

    return <Outlet />;
}
