import { Link } from "react-router-dom";

export function ServicesHeroSection() {
    return (
        <section className="ix-services-hero ix-services-hero-final">
            <div className="public-container ix-services-hero-grid">
                <div>
                    <p className="ix-breadcrumb">
                        <Link to="/">Inicio</Link> <span>/</span> Servicios
                    </p>
                    <p className="ix-kicker ix-kicker-light">Servicios técnicos</p>
                    <h1>
                        Metrología, consultoría
                        <br />
                        y <span>auditoría.</span>
                    </h1>
                    <p>
                        Revisa las áreas de servicio, sus alcances publicados y las opciones de soporte técnico.
                    </p>
                </div>
                <figure className="ix-services-hero-media">
                    <img
                        src="/images/services/hero-servicios.webp"
                        alt="Especialista trabajando en una estación de calibración"
                        fetchPriority="high"
                    />
                    <figcaption>
                        <span>Servicios técnicos / ISOCAL</span>
                        <strong>Servicios técnicos para industria y laboratorio</strong>
                    </figcaption>
                </figure>
            </div>
        </section>
    );
}
