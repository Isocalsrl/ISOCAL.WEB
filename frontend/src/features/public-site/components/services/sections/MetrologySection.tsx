import { Link } from "react-router-dom";
import { CorporateIcon } from "../../../../../shared/components/ui/CorporateIcon";
import { CalibrationExplorer } from "../../CalibrationExplorer";

export function MetrologySection() {
    return (
        <section className="ix-section ix-metrology-section" id="metrologia">
            <div className="public-container">
                <header className="ix-section-intro ix-section-intro-split ix-section-intro-compact">
                    <div>
                        <p className="ix-kicker">01 / Metrología</p>
                        <h2>Calibración por magnitud e instrumento.</h2>
                    </div>
                    <div className="ix-section-action-copy">
                        <p>
                            Revisa las magnitudes del portafolio y los instrumentos incluidos en cada grupo.
                        </p>
                        <div className="ix-metrology-actions">
                            <a
                                className="ix-inline-link"
                                href="/portfolio/portafolio-isocal-2025.pdf"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Portafolio completo <CorporateIcon name="arrow" />
                            </a>
                            <Link className="ix-inline-link" to="/herramientas#conversores">
                                Convertir unidades <CorporateIcon name="arrow" />
                            </Link>
                        </div>
                    </div>
                </header>
                <CalibrationExplorer />
                <div className="ix-metrology-advisor-callout">
                    <span>¿No ubicas tu instrumento?</span>
                    <p>El orientador te ayuda a ubicar la magnitud y el servicio relacionado.</p>
                    <a className="ix-inline-link" href="#orientador">
                        Usar orientador <CorporateIcon name="arrow" />
                    </a>
                </div>
            </div>
        </section>
    );
}
