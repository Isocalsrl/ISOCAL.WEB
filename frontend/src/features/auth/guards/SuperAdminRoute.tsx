import {
    Navigate,
    Outlet,
} from "react-router-dom";

import {
    useAuth,
} from "../hooks/useAuth";

export function SuperAdminRoute() {
    const {
        admin,
    } = useAuth();

    if (admin?.role !== "super_admin") {
        return (
            <Navigate
                to="/admin/products"
                replace
            />
        );
    }

    return <Outlet />;
}
