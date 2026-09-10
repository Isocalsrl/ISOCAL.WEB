import {
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    ApiError,
} from "../../../shared/api/httpClient";

import {
    InlineAlert,
} from "../../../shared/components/feedback/InlineAlert";

import {
    useAuth,
} from "../hooks/useAuth";

import "../styles/auth.css";

export function AdminDashboardPage() {
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
                error instanceof ApiError &&
                    error.code ===
                        "NETWORK_ERROR"
                    ? "No se pudo conectar con el servidor para cerrar la sesión."
                    : "No se pudo cerrar la sesión. Inténtalo otra vez.",
            );
        } finally {
            setIsLoggingOut(false);
        }
    }

    return (
        <main className="dashboard-page">
            <header className="dashboard-header">
                <Link
                    className="brand-mark brand-mark-dark"
                    to="/"
                >
                    <span className="brand-symbol">
                        I
                    </span>

                    <span>ISOCAL</span>
                </Link>

                <div className="admin-actions">
                    <span>
                        {admin?.name}
                    </span>

                    <button
                        type="button"
                        onClick={() => {
                            void handleLogout();
                        }}
                        disabled={
                            isLoggingOut
                        }
                    >
                        {isLoggingOut
                            ? "Cerrando..."
                            : "Cerrar sesión"}
                    </button>
                </div>
            </header>

            <section className="dashboard-content">
                <p className="eyebrow">
                    Panel administrativo
                </p>

                <h1>
                    Hola, {admin?.name}
                </h1>

                <p>
                    La autenticación y la
                    protección de rutas están
                    funcionando. Los módulos
                    del panel pueden
                    conectarse en esta ruta.
                </p>

                {logoutError && (
                    <InlineAlert>
                        {logoutError}
                    </InlineAlert>
                )}
            </section>
        </main>
    );
}
