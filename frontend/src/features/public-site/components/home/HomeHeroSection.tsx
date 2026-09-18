import { Link } from "react-router-dom";
import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";

export function HomeHeroSection() {
    return (
        <section className="ix-home-hero">
            <div className="ix-home-hero-media" aria-hidden="true">
                <img
                    src="/images/company/laboratorio-hero.png"
                    alt=""
                    fetchPriority="high"
                />
            </div>
            <div className="ix-home-hero-overlay" aria-hidden="true" />
            <div className="ix-home-hero-floaters" aria-hidden="true">
                <div className="ix-home-hero-floater ix-home-hero-floater-pressure">
                    <span>01</span><strong>Presión</strong><small>Medición industrial</small>
                </div>
                <div className="ix-home-hero-floater ix-home-hero-floater-temperature">
                    <span>02</span><strong>Temperatura</strong><small>Control de proceso</small>
                </div>
                <div className="ix-home-hero-floater ix-home-hero-floater-mass">
                    <span>03</span><strong>Masa</strong><small>Laboratorio + operación</small>
                </div>
            </div>
            <div className="public-container ix-home-hero-grid">
                <div className="ix-home-hero-copy">
                    <p className="ix-kicker">ISOCAL · Metrología para la industria</p>
                    <h1>
                        Mediciones que
                        <br />
                        mejoran <span>decisiones.</span>
                    </h1>
                    <p className="ix-lead">
                        Calibración, consultoría y equipamiento para empresas, laboratorios y
                        operaciones que necesitan medir con criterios técnicos claros.
                    </p>
                    <div className="ix-actions">
                        <Link className="ix-button ix-button-primary" to="/cotizacion">
                            Solicitar cotización <CorporateIcon name="arrow" />
                        </Link>
                        <Link className="ix-button ix-button-ghost-light" to="/servicios">
                            Explorar servicios <CorporateIcon name="arrow" />
                        </Link>
                    </div>
                </div>
            </div>
            <div className="ix-home-hero-caption">
                <span>Metrología aplicada</span>
                <strong>Industria + laboratorio</strong>
            </div>
        </section>
    );
}
