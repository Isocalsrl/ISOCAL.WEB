import {
    ActionLink,
} from "../../../shared/components/ui/ActionLink";

const VALUE_ITEMS = [
    {
        number: "01",
        title: "Rigor técnico",
        description:
            "Cada solución parte de comprender la necesidad real del proceso de medición.",
    },
    {
        number: "02",
        title: "Atención cercana",
        description:
            "Acompañamos cada consulta con información clara y orientación especializada.",
    },
    {
        number: "03",
        title: "Mejora continua",
        description:
            "Trabajamos para fortalecer la confiabilidad y el control de cada operación.",
    },
] as const;

export function HomePage() {
    return (
        <main className="public-main">
            <section className="public-home-hero">
                <div className="public-container public-home-hero-grid">
                    <div className="public-home-hero-copy">
                        <p className="eyebrow">
                            Consultoría y metrología
                        </p>

                        <h1>
                            Precisión que respalda
                            cada decisión.
                        </h1>

                        <p className="public-home-hero-description">
                            Ayudamos a fortalecer tus
                            procesos de medición con
                            soluciones técnicas,
                            atención especializada y
                            un enfoque orientado a la
                            confiabilidad.
                        </p>

                        <div className="public-actions">
                            <ActionLink
                                to="/servicios"
                            >
                                Conocer servicios
                            </ActionLink>

                            <ActionLink
                                variant="secondary"
                                to="/productos"
                            >
                                Ver productos
                            </ActionLink>
                        </div>
                    </div>

                    <div
                        className="public-home-hero-panel"
                        aria-label="Áreas de trabajo de ISOCAL"
                    >
                        <span className="public-home-hero-code">
                            ISO / CAL
                        </span>

                        <strong>
                            Medir.
                            <br />
                            Verificar.
                            <br />
                            Mejorar.
                        </strong>

                        <div className="public-home-hero-tags">
                            <span>Metrología</span>
                            <span>Consultoría</span>
                            <span>Soluciones</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="public-section">
                <div className="public-container">
                    <div className="public-section-heading">
                        <div>
                            <p className="eyebrow">
                                Nuestro enfoque
                            </p>

                            <h2>
                                Confianza construida
                                desde la precisión.
                            </h2>
                        </div>

                        <p>
                            Integramos conocimiento,
                            orden y acompañamiento para
                            ayudarte a tomar mejores
                            decisiones sobre tus
                            procesos de medición.
                        </p>
                    </div>

                    <div className="public-value-grid">
                        {VALUE_ITEMS.map(
                            (valueItem) => (
                                <article
                                    key={valueItem.number}
                                    className="public-value-card"
                                >
                                    <span>
                                        {valueItem.number}
                                    </span>

                                    <h3>
                                        {valueItem.title}
                                    </h3>

                                    <p>
                                        {valueItem.description}
                                    </p>
                                </article>
                            ),
                        )}
                    </div>
                </div>
            </section>

            <section className="public-contrast-section">
                <div className="public-container public-contrast-content">
                    <div>
                        <p className="eyebrow eyebrow-light">
                            Conoce ISOCAL
                        </p>

                        <h2>
                            Una solución técnica debe
                            ser también clara y útil.
                        </h2>
                    </div>

                    <ActionLink
                        variant="light"
                        to="/nosotros"
                    >
                        Saber más
                    </ActionLink>
                </div>
            </section>
        </main>
    );
}
