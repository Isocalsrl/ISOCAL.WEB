import {
    ActionLink,
} from "../../../../../shared/components/ui/ActionLink";

export function ServicesHeroSection() {
    return (
        <section
            className="services-hero"
            aria-labelledby="services-hero-title"
        >
            <img
                className="services-hero-image"
                src="/images/services/hero-servicios.webp"
                alt="Especialista trabajando con instrumentos de medición"
                width="1920"
                height="1100"
                fetchPriority="high"
                decoding="async"
            />

            <div
                className="services-hero-overlay"
                aria-hidden="true"
            />

            <div className="public-container services-hero-content">
                <div className="services-hero-copy">
                    <p className="services-hero-kicker">
                        Servicios · ISOCAL
                    </p>

                    <h1 id="services-hero-title">
                        Capacidad técnica
                        para medir,
                        evaluar y mejorar.
                    </h1>

                    <p className="services-hero-description">
                        Integramos
                        metrología,
                        consultoría y
                        auditoría para
                        responder a
                        necesidades
                        técnicas de la
                        industria y los
                        laboratorios.
                    </p>

                    <ActionLink
                        variant="light"
                        to="/productos"
                    >
                        Explorar productos
                    </ActionLink>
                </div>
            </div>
        </section>
    );
}
