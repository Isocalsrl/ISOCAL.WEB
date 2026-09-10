import {
    Link,
} from "react-router-dom";

export function PublicCatalogPage() {
    return (
        <main className="public-page">
            <div className="public-card">
                <p className="eyebrow">
                    Catálogo público
                </p>

                <h1>ISOCAL</h1>

                <p>
                    Esta ruta permanece
                    disponible sin iniciar
                    sesión. Aquí se integrará
                    el catálogo público de
                    productos.
                </p>

                <Link to="/admin/login">
                    Acceso administrativo
                </Link>
            </div>
        </main>
    );
}
