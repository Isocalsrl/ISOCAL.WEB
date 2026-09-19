import { Count } from "../Corporate";
import { ABOUT_OVERVIEW } from "../../data/about";

export function AboutOverviewSection() {
    return (
        <section className="ix-section ix-about-overview">
            <div className="public-container ix-about-overview-grid">
                <div className="ix-about-overview-media">
                    <img src="/images/company/met.webp" alt="Laboratorio de la red metrológica" />
                    <span className="ix-image-caption">01 / Capacidad metrológica</span>
                </div>
                <div className="ix-about-overview-copy">
                    <p className="ix-kicker">ISOCAL</p>
                    <h2>Red metrológica y servicios técnicos.</h2>
                    <div className="ix-about-overview-prose">
                        <p>{ABOUT_OVERVIEW}</p>
                        <p>
                            El portafolio combina calibración, equipamiento y capacitación para atender necesidades metrológicas de empresas y laboratorios.
                        </p>
                    </div>
                    <div className="ix-stat-ledger">
                        <Count value={19} label="Áreas de calibración" />
                        <Count value={4} label="Laboratorios aliados" />
                        <Count value={3} label="Líneas de servicio" />
                    </div>
                </div>
            </div>
        </section>
    );
}
