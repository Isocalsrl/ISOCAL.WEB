import { Link } from "react-router-dom";
import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";
import { HOME_CAPABILITY_IDS } from "../../data/homePage";
import { CALIBRATION_GROUPS } from "../../data/services/metrology";

export function HomeCapabilitySection() {
    const capabilities = CALIBRATION_GROUPS.filter((group) =>
        HOME_CAPABILITY_IDS.includes(group.id as (typeof HOME_CAPABILITY_IDS)[number]),
    );

    return (
        <section className="ix-section ix-capability-preview">
            <div className="public-container ix-capability-preview-grid">
                <div className="ix-capability-copy">
                    <p className="ix-kicker">Calibración</p>
                    <h2>Capacidades por magnitud e instrumento.</h2>
                    <p>
                        Revisa algunas magnitudes del portafolio y los instrumentos incluidos en cada grupo.
                    </p>
                    <Link className="ix-inline-link" to="/servicios#metrologia">
                        Ver capacidades de calibración <CorporateIcon name="arrow" />
                    </Link>
                    <Link className="ix-capability-tool-link" to="/herramientas#conversores">
                        Convertir unidades <CorporateIcon name="arrow" />
                    </Link>
                </div>
                <div className="ix-capability-list">
                    {capabilities.map((group, index) => (
                        <Link key={group.id} to={`/servicios#metrologia`} className="ix-capability-row">
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <strong>{group.title}</strong>
                            <small>{group.items.slice(0, 3).join(" · ")}</small>
                            <CorporateIcon name="arrow" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
