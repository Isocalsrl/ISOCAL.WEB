import {
    ActionLink,
} from "../../../shared/components/ui/ActionLink";

import {
    PageHero,
} from "../components/PageHero";

const PRINCIPLES = [
    {
        title: "Claridad",
        description:
            "Explicamos cada alternativa de forma directa para facilitar decisiones informadas.",
    },
    {
        title: "Responsabilidad",
        description:
            "Abordamos cada necesidad con orden, cuidado técnico y compromiso con el proceso.",
    },
    {
        title: "Cercanía",
        description:
            "Escuchamos antes de proponer para construir una solución adecuada a cada contexto.",
    },
] as const;

export function AboutPage() {
    return (
        <main className="public-main">
            <PageHero
                eyebrow="Nosotros"
                title="Conocimiento técnico al servicio de tu operación."
                description="En ISOCAL trabajamos para que la metrología sea una herramienta práctica, comprensible y útil para el control de tus procesos."
            />

            <section className="public-section">
                <div className="public-container public-story-grid">
                    <div className="public-story-marker">
                        <span>ISOCAL</span>

                        <strong>
                            Precisión
                            <br />
                            con propósito.
                        </strong>
                    </div>

                    <div className="public-story-copy">
                        <p className="eyebrow">
                            Cómo trabajamos
                        </p>

                        <h2>
                            Primero entendemos el
                            proceso. Después proponemos
                            la solución.
                        </h2>

                        <p>
                            Cada organización enfrenta
                            necesidades distintas. Por
                            eso partimos del contexto,
                            los objetivos y los puntos
                            críticos de medición antes
                            de recomendar un servicio o
                            producto.
                        </p>

                        <p>
                            Nuestro enfoque combina
                            orientación técnica y una
                            comunicación cercana para
                            convertir requerimientos
                            complejos en acciones
                            concretas.
                        </p>
                    </div>
                </div>
            </section>

            <section className="public-section public-section-muted">
                <div className="public-container">
                    <div className="public-section-heading">
                        <div>
                            <p className="eyebrow">
                                Principios
                            </p>

                            <h2>
                                La forma en que
                                construimos confianza.
                            </h2>
                        </div>

                        <p>
                            Una base simple para
                            mantener relaciones técnicas
                            sólidas y resultados útiles.
                        </p>
                    </div>

                    <div className="public-principles-grid">
                        {PRINCIPLES.map(
                            (principle) => (
                                <article
                                    key={principle.title}
                                    className="public-principle-card"
                                >
                                    <h3>
                                        {principle.title}
                                    </h3>

                                    <p>
                                        {principle.description}
                                    </p>
                                </article>
                            ),
                        )}
                    </div>
                </div>
            </section>

            <section className="public-callout-section">
                <div className="public-container public-callout">
                    <div>
                        <p className="eyebrow">
                            Siguiente paso
                        </p>

                        <h2>
                            Descubre cómo podemos
                            acompañar tu proceso.
                        </h2>
                    </div>

                    <ActionLink
                        to="/servicios"
                    >
                        Ver servicios
                    </ActionLink>
                </div>
            </section>
        </main>
    );
}
