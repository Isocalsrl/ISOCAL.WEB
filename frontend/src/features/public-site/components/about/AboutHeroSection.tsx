import { Link } from "react-router-dom";

export function AboutHeroSection() {
    return (
        <section className="ix-about-hero ix-about-hero-final">
            <div className="public-container ix-about-hero-grid">
                <div className="ix-about-hero-copy">
                    <p className="ix-breadcrumb">
                        <Link to="/">Inicio</Link> <span>/</span> Nosotros
                    </p>
                    <p className="ix-kicker ix-kicker-light">Nosotros</p>
                    <h1>
                        Metrología para
                        <br />
                        <span>industria y laboratorios.</span>
                    </h1>
                    <p>
                        Conoce al equipo, la red de laboratorios aliados y las líneas de servicio de ISOCAL.
                    </p>
                    <div className="ix-about-hero-index" aria-label="Sección uno: equipo y capacidad">
                        <span>01</span>
                        <span>Equipo y capacidad técnica</span>
                    </div>
                </div>
                <figure className="ix-about-hero-media">
                    <img src="/images/company/ORIGG.png" alt="Equipo de ISOCAL" fetchPriority="high" />
                    <figcaption>
                        <span>ISOCAL / Lima, Perú</span>
                        <strong>Equipo técnico de ISOCAL</strong>
                    </figcaption>
                </figure>
            </div>
        </section>
    );
}
