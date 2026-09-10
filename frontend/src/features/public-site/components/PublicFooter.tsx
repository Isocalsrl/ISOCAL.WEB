import {
    Link,
} from "react-router-dom";

import {
    BrandMark,
} from "../../../shared/components/brand/BrandMark";

import {
    PUBLIC_NAVIGATION_ITEMS,
} from "../constants/publicNavigation";

export function PublicFooter() {
    const currentYear =
        new Date().getFullYear();

    return (
        <footer className="public-footer">
            <div className="public-container public-footer-grid">
                <div className="public-footer-brand">
                    <BrandMark />

                    <p>
                        Soluciones de consultoría
                        y metrología orientadas a
                        procesos de medición más
                        confiables.
                    </p>
                </div>

                <div className="public-footer-column">
                    <h2>Navegación</h2>

                    <nav aria-label="Navegación del pie de página">
                        {PUBLIC_NAVIGATION_ITEMS.map(
                            (navigationItem) => (
                                <Link
                                    key={navigationItem.to}
                                    to={navigationItem.to}
                                >
                                    {navigationItem.label}
                                </Link>
                            ),
                        )}
                    </nav>
                </div>

                <div className="public-footer-column">
                    <h2>ISOCAL</h2>

                    <p>
                        Conoce nuestras soluciones
                        y encuentra la alternativa
                        adecuada para tu proceso.
                    </p>

                    <Link
                        className="public-footer-highlight"
                        to="/servicios"
                    >
                        Explorar servicios
                    </Link>
                </div>
            </div>

            <div className="public-footer-bottom">
                <div className="public-container public-footer-bottom-content">
                    <p>
                        © {currentYear} ISOCAL.
                        Todos los derechos
                        reservados.
                    </p>

                </div>
            </div>
        </footer>
    );
}
