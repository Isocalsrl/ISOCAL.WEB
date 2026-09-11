import {
    useState,
} from "react";

import {
    NavLink,
    Outlet,
} from "react-router-dom";

import {
    BrandMark,
} from "../../../shared/components/brand/BrandMark";

import {
    InlineAlert,
} from "../../../shared/components/feedback/InlineAlert";

import {
    Button,
} from "../../../shared/components/ui/Button";

import {
    ApiError,
} from "../../../shared/api/httpClient";

import {
    useAuth,
} from "../../auth/hooks/useAuth";

import "../styles/admin/index.css";

function navigationClass({
    isActive,
}: {
    isActive: boolean;
}): string {
    return isActive
        ? "admin-navigation-link admin-navigation-link-active"
        : "admin-navigation-link";
}

export function AdminLayout() {
    const {
        admin,
        logout,
    } = useAuth();

    const [
        isLoggingOut,
        setIsLoggingOut,
    ] = useState(false);

    const [
        logoutError,
        setLogoutError,
    ] = useState<string | null>(
        null,
    );

    async function handleLogout():
        Promise<void> {
        setLogoutError(null);
        setIsLoggingOut(true);

        try {
            await logout();
        } catch (error) {
            setLogoutError(
                error instanceof ApiError
                    ? error.message
                    : "No se pudo cerrar la sesión.",
            );
        } finally {
            setIsLoggingOut(false);
        }
    }

    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <BrandMark />

                <div className="admin-sidebar-label">
                    Panel administrativo
                </div>

                <nav
                    className="admin-navigation"
                    aria-label="Navegación administrativa"
                >
                    <NavLink
                        className={navigationClass}
                        to="/admin/products"
                    >
                        <span>01</span>
                        Productos
                    </NavLink>

                    <NavLink
                        className={navigationClass}
                        to="/admin/categories"
                    >
                        <span>02</span>
                        Categorías
                    </NavLink>

                    <NavLink
                        className={navigationClass}
                        to="/admin/quotes"
                    >
                        <span>03</span>
                        Cotizaciones
                    </NavLink>

                    {admin?.role ===
                        "super_admin" && (
                        <NavLink
                            className={navigationClass}
                            to="/admin/access-history"
                        >
                            <span>04</span>
                            Registro de accesos
                        </NavLink>
                    )}
                </nav>

                <p className="admin-sidebar-footer">
                    Gestión de contenidos
                </p>
            </aside>

            <div className="admin-workspace">
                <header className="admin-topbar">
                    <div className="admin-identity">
                        <span className="admin-identity-name">
                            {admin?.name}
                        </span>

                        <span className="admin-identity-role">
                            {admin?.role ===
                            "super_admin"
                                ? "Super administrador"
                                : "Administrador"}
                        </span>
                    </div>

                    <Button
                        type="button"
                        variant="secondary"
                        isLoading={isLoggingOut}
                        loadingLabel="Cerrando..."
                        onClick={() => {
                            void handleLogout();
                        }}
                    >
                        Cerrar sesión
                    </Button>
                </header>

                {logoutError && (
                    <div className="admin-global-alert">
                        <InlineAlert>
                            {logoutError}
                        </InlineAlert>
                    </div>
                )}

                <div className="admin-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
