import { Link } from "react-router-dom";
import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";

export function HomeAdvisorSection() {
    return (
        <section className="ix-home-advisor" aria-labelledby="advisor-home-title">
            <div className="public-container ix-home-advisor-grid">
                <div className="ix-home-advisor-media">
                    <img src="/images/services/metrologia-detalle.webp" alt="Equipo técnico de metrología de ISOCAL" loading="lazy" />
                    <span>RUTA TÉCNICA / ISOCAL</span>
                </div>
                <div className="ix-home-advisor-copy">
                    <p className="ix-kicker">Orientador técnico</p>
                    <h2 id="advisor-home-title">¿Tienes un equipo pero no sabes qué servicio corresponde?</h2>
                    <p>Selecciona el equipo, la magnitud y, si lo conoces, el rango. La herramienta te mostrará el servicio publicado más relacionado.</p>
                    <div className="ix-home-advisor-actions">
                        <Link className="ix-button ix-button-primary" to="/herramientas#orientador">Usar orientador <CorporateIcon name="arrow" /></Link>
                        <Link className="ix-inline-link" to="/servicios#metrologia">Explorar metrología <CorporateIcon name="arrow" /></Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
