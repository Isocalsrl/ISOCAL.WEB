import {
    ActionLink,
} from "../../../shared/components/ui/ActionLink";

import {
    PageHero,
} from "../../public-site/components/PageHero";

const CATALOG_BENEFITS = [
    "Productos organizados por categoría",
    "Información clara para comparar alternativas",
    "Orientación para elegir según tu necesidad",
] as const;

export function PublicCatalogPage() {
    return (
        <main className="public-main">
            <PageHero
                eyebrow="Productos"
                title="Soluciones para acompañar tus procesos de medición."
                description="Explora la propuesta de ISOCAL y encuentra productos alineados con las necesidades técnicas de tu operación."
            />

            <section className="public-section">
                <div className="public-container public-catalog-placeholder">
                    <div className="public-catalog-status">
                        <span aria-hidden="true" />
                        Catálogo digital
                    </div>

                    <div className="public-catalog-copy">
                        <p className="eyebrow">
                            Próximamente
                        </p>

                        <h2>
                            Estamos preparando una
                            experiencia de consulta más
                            completa.
                        </h2>

                        <p>
                            Muy pronto podrás revisar el
                            catálogo disponible desde
                            esta sección. Mientras tanto,
                            conoce cómo podemos ayudarte
                            desde nuestros servicios.
                        </p>

                        <ActionLink
                            to="/servicios"
                        >
                            Conocer servicios
                        </ActionLink>
                    </div>

                    <ul className="public-catalog-benefits">
                        {CATALOG_BENEFITS.map(
                            (benefit) => (
                                <li key={benefit}>
                                    {benefit}
                                </li>
                            ),
                        )}
                    </ul>
                </div>
            </section>
        </main>
    );
}
