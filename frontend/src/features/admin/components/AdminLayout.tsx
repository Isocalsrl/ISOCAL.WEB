import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { ApiError } from "../../../shared/api/httpClient";
import { BrandMark } from "../../../shared/components/brand/BrandMark";
import { InlineAlert } from "../../../shared/components/feedback/InlineAlert";
import { Button } from "../../../shared/components/ui/Button";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";
import { useAuth } from "../../auth/hooks/useAuth";
import "../styles/admin.css";

interface NavigationItem {
    to: string;
    label: string;
    description: string;
    icon: "layers" | "package" | "book" | "clipboard" | "shield" | "clock";
    superAdminOnly?: boolean;
}

const navigationItems: NavigationItem[] = [
    { to: "/admin", label: "Resumen", description: "Vista general", icon: "layers" },
    { to: "/admin/products", label: "Productos", description: "Catálogo público", icon: "package" },
    { to: "/admin/categories", label: "Categorías", description: "Clasificación", icon: "clipboard" },
    { to: "/admin/blog", label: "Blog", description: "Artículos y contenidos", icon: "book" },
    { to: "/admin/admins", label: "Administradores", description: "Cuentas y permisos", icon: "shield", superAdminOnly: true },
    { to: "/admin/access-history", label: "Accesos", description: "Actividad del panel", icon: "clock", superAdminOnly: true },
];

function navigationClass({ isActive }: { isActive: boolean }): string {
    return isActive ? "admin-navigation-link admin-navigation-link-active" : "admin-navigation-link";
}

export function AdminLayout() {
    const { admin, logout } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState<string | null>(null);
    const [isNavigationOpen, setIsNavigationOpen] = useState(false);

    async function handleLogout(): Promise<void> {
        setLogoutError(null);
        setIsLoggingOut(true);
        try {
            await logout();
        } catch (error) {
            setLogoutError(error instanceof ApiError ? error.message : "No se pudo cerrar la sesión.");
        } finally {
            setIsLoggingOut(false);
        }
    }

    return (
        <div className="admin-shell">
            <aside className={`admin-sidebar ${isNavigationOpen ? "admin-sidebar-open" : ""}`}>
                <div className="admin-sidebar-brand">
                    <BrandMark to="/admin" subtitle="Panel de gestión" />
                    <button
                        className="admin-mobile-close"
                        type="button"
                        aria-label="Cerrar navegación"
                        onClick={() => setIsNavigationOpen(false)}
                    >
                        <CorporateIcon name="close" />
                    </button>
                </div>

                <div className="admin-sidebar-context">
                    <span>Administración</span>
                    <strong>ISOCAL</strong>
                    <p>Gestiona lo que se publica y las cuentas que pueden acceder al sistema.</p>
                </div>

                <nav className="admin-navigation" aria-label="Navegación administrativa">
                    {navigationItems
                        .filter((item) => !item.superAdminOnly || admin?.role === "super_admin")
                        .map((item) => (
                            <NavLink
                                end={item.to === "/admin"}
                                className={navigationClass}
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsNavigationOpen(false)}
                            >
                                <span className="admin-navigation-icon" aria-hidden="true">
                                    <CorporateIcon name={item.icon} />
                                </span>
                                <span className="admin-navigation-copy">
                                    <strong>{item.label}</strong>
                                    <small>{item.description}</small>
                                </span>
                                <CorporateIcon className="admin-navigation-arrow" name="arrow" />
                            </NavLink>
                        ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <Link to="/" target="_blank" rel="noreferrer">
                        <span>Ver sitio público</span>
                        <CorporateIcon name="external" />
                    </Link>
                </div>
            </aside>

            {isNavigationOpen && (
                <button
                    className="admin-sidebar-backdrop"
                    type="button"
                    aria-label="Cerrar navegación"
                    onClick={() => setIsNavigationOpen(false)}
                />
            )}

            <div className="admin-workspace">
                <div className="admin-utility-bar">
                    <span>Metrología, consultoría y equipamiento</span>
                    <a href="mailto:ventas@isocal.pe">ventas@isocal.pe</a>
                </div>

                <header className="admin-topbar">
                    <div className="admin-topbar-start">
                        <button
                            className="admin-mobile-menu"
                            type="button"
                            aria-label="Abrir navegación"
                            aria-expanded={isNavigationOpen}
                            onClick={() => setIsNavigationOpen(true)}
                        >
                            <CorporateIcon name="menu" />
                        </button>
                        <div>
                            <span className="admin-topbar-kicker">Panel interno</span>
                            <strong className="admin-topbar-title">Gestión de contenidos</strong>
                        </div>
                    </div>

                    <div className="admin-topbar-actions">
                        <Link className="admin-public-link" to="/" target="_blank">
                            Sitio público <CorporateIcon name="external" />
                        </Link>
                        <div className="admin-identity">
                            <span className="admin-identity-avatar" aria-hidden="true">
                                {admin?.name?.trim().charAt(0).toUpperCase() || "I"}
                            </span>
                            <span className="admin-identity-copy">
                                <span className="admin-identity-name">{admin?.name}</span>
                                <span className="admin-identity-role">
                                    {admin?.role === "super_admin" ? "Superadministrador" : "Administrador"}
                                </span>
                            </span>
                        </div>
                        <Button
                            className="admin-logout-button"
                            type="button"
                            variant="secondary"
                            isLoading={isLoggingOut}
                            loadingLabel="Cerrando..."
                            onClick={() => void handleLogout()}
                        >
                            Salir
                        </Button>
                    </div>
                </header>

                {logoutError && (
                    <div className="admin-global-alert">
                        <InlineAlert>{logoutError}</InlineAlert>
                    </div>
                )}

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
