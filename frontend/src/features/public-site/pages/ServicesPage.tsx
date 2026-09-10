import {
    ActionLink,
} from "../../../shared/components/ui/ActionLink";

import {
    PageHero,
} from "../components/PageHero";

const SERVICES = [
    {
        number: "01",
        title: "Servicios de metrología",
        description:
            "Soporte para fortalecer la confiabilidad de las mediciones que intervienen en tu operación.",
        detail:
            "Revisamos la necesidad técnica y orientamos el servicio de acuerdo con el instrumento y el proceso.",
    },
    {
        number: "02",
        title: "Consultoría especializada",
        description:
            "Acompañamiento para ordenar requerimientos y convertirlos en acciones de mejora aplicables.",
        detail:
            "Partimos del contexto de la organización para proponer una ruta clara y comprensible.",
    },
    {
        number: "03",
        title: "Orientación en soluciones",
        description:
            "Asesoría para identificar productos y alternativas alineadas con las necesidades del proceso.",
        detail:
            "Comparamos el uso esperado, las condiciones de trabajo y los objetivos antes de recomendar.",
    },
] as const;

export function ServicesPage() {
    return (
        <main className="public-main">
            <PageHero
                eyebrow="Servicios"
                title="Soluciones pensadas para procesos que exigen confianza."
                description="Combinamos orientación técnica, metrología y consultoría para ayudarte a resolver necesidades concretas de medición y control."
                actions={
                    <ActionLink
                        to="/productos"
                    >
                        Explorar productos
                    </ActionLink>
                }
            />

            <section className="public-section">
                <div className="public-container public-services-list">
                    {SERVICES.map(
                        (service) => (
                            <article
                                key={service.number}
                                className="public-service-card"
                            >
                                <span className="public-service-number">
                                    {service.number}
                                </span>

                                <div>
                                    <h2>
                                        {service.title}
                                    </h2>

                                    <p>
                                        {service.description}
                                    </p>
                                </div>

                                <p className="public-service-detail">
                                    {service.detail}
                                </p>
                            </article>
                        ),
                    )}
                </div>
            </section>

            <section className="public-contrast-section">
                <div className="public-container public-contrast-content">
                    <div>
                        <p className="eyebrow eyebrow-light">
                            Una necesidad, una ruta clara
                        </p>

                        <h2>
                            Conversemos sobre el proceso
                            que necesitas fortalecer.
                        </h2>
                    </div>

                    <ActionLink
                        variant="light"
                        to="/nosotros"
                    >
                        Conocer ISOCAL
                    </ActionLink>
                </div>
            </section>
        </main>
    );
}
