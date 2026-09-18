import { Link } from "react-router-dom";
import { PageSeo } from "../../../shared/seo/PageSeo";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";
import { MetrologyConverter } from "../components/MetrologyConverter";
import { ServiceAdvisor } from "../components/ServiceAdvisor";

export function TechnicalToolsPage() {
    return (
        <main className="technical-tools-page">
            <PageSeo
                title="Herramientas metrológicas | ISOCAL"
                description="Convierte unidades de presión, temperatura, masa y longitud, o encuentra el servicio adecuado para tu instrumento."
                canonicalPath="/herramientas"
            />

            <section className="tools-hero" aria-labelledby="tools-hero-title">
                <div className="public-container tools-hero-inner">
                    <div className="tools-hero-copy">
                        <p className="ix-breadcrumb"><Link to="/">Inicio</Link> <span>/</span> Herramientas</p>
                        <p className="ix-kicker ix-kicker-light">Herramientas técnicas</p>
                        <h1 id="tools-hero-title">Herramientas para consultas rápidas.</h1>
                        <p>Convierte unidades o ubica el servicio relacionado con tu equipo.</p>
                        <nav className="tools-hero-links" aria-label="Herramientas disponibles">
                            <a className="ix-button ix-button-light" href="#conversores">Convertir unidades <CorporateIcon name="arrow" /></a>
                            <a className="ix-button ix-button-ghost-light" href="#orientador">Buscar un servicio <CorporateIcon name="arrow" /></a>
                        </nav>
                    </div>
                    <div className="tools-hero-media">
                        <img
                            src="/images/products/catalogo-editorial.webp"
                            alt="Instrumentos de medición para el trabajo en laboratorio"
                            fetchPriority="high"
                        />
                    </div>
                </div>
            </section>

            <section className="ix-section technical-tools-section">
                <div className="public-container">
                    <MetrologyConverter />
                </div>
            </section>

            <section className="ix-section technical-tools-section technical-tools-section-soft">
                <div className="public-container">
                    <ServiceAdvisor />
                </div>
            </section>

            <section className="technical-tools-contact-strip">
                <div className="public-container">
                    <p>¿Necesitas confirmar si un servicio aplica a tu equipo?</p>
                    <Link to="/contacto">Contactar a ISOCAL <CorporateIcon name="arrow" /></Link>
                </div>
            </section>
        </main>
    );
}

