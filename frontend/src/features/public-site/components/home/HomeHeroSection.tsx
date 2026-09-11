import {
    ActionLink,
} from "../../../../shared/components/ui/ActionLink";

export function HomeHeroSection() {
    return (
        <section
            className="home-hero"
            aria-labelledby="home-hero-title"
        >
            <img
                className="home-hero-image"
                src="/images/home/hero-equipo-isocal.webp"
                alt="Equipo de ISOCAL"
                width="1920"
                height="1200"
                fetchPriority="high"
                decoding="async"
            />

            <div
                className="home-hero-overlay"
                aria-hidden="true"
            />

            <div className="public-container home-hero-content">
                <div className="home-hero-copy">
                    <p className="home-hero-kicker">
                        Red metrológica ·
                        Industria y
                        laboratorios
                    </p>

                    <h1 id="home-hero-title">
                        Mediciones que
                        mejoran decisiones.
                    </h1>

                    <p className="home-hero-description">
                        Servicios integrales
                        de metrología,
                        consultoría y
                        auditoría para
                        organizaciones que
                        necesitan confianza
                        en sus mediciones y
                        procesos.
                    </p>

                    <div className="home-hero-actions">
                        <ActionLink
                            to="/servicios"
                        >
                            Conocer servicios
                        </ActionLink>

                        <ActionLink
                            variant="light"
                            to="/productos"
                        >
                            Ver productos
                        </ActionLink>
                    </div>
                </div>
            </div>
        </section>
    );
}
