export function AboutHeroSection() {
    return (
        <section
            className="about-hero"
            aria-labelledby="about-hero-title"
        >
            <img
                className="about-hero-image"
                src="/images/about/hero-nosotros.webp"
                alt="Equipo de ISOCAL"
                width="1920"
                height="1100"
                fetchPriority="high"
                decoding="async"
            />

            <div
                className="about-hero-overlay"
                aria-hidden="true"
            />

            <div className="public-container about-hero-content">
                <div className="about-hero-copy">
                    <p className="about-hero-kicker">
                        Nosotros · ISOCAL
                    </p>

                    <h1 id="about-hero-title">
                        Una red metrológica
                        al servicio de la
                        industria.
                    </h1>

                    <p className="about-hero-description">
                        Integramos
                        conocimiento,
                        capacidad técnica y
                        laboratorios
                        acreditados para
                        responder a las
                        necesidades
                        metrológicas de
                        nuestros clientes.
                    </p>
                </div>
            </div>
        </section>
    );
}
