import { CorporateIcon } from "../../../../../shared/components/ui/CorporateIcon";
import { ServiceAdvisor } from "../../../../technical-tools/components/ServiceAdvisor";

export function ServicesAdvisorSection() {
    return (
        <section className="technical-service-advisor-section ix-services-advisor" aria-label="Orientador de servicios">
            <div className="public-container ix-services-advisor-shell">
                <header className="ix-services-advisor-intro">
                    <p className="ix-kicker">Orientador técnico</p>
                    <h2>¿Tienes un equipo y no sabes qué servicio corresponde?</h2>
                    <p>
                        Identifica la magnitud, indica el rango si lo conoces y revisa una ruta
                        de servicio antes de hablar con ISOCAL.
                    </p>
                    <a className="ix-inline-link" href="#orientador">
                        Iniciar orientación <CorporateIcon name="arrow" />
                    </a>
                </header>
                <div className="ix-services-advisor-workbench">
                    <ServiceAdvisor />
                </div>
            </div>
        </section>
    );
}
