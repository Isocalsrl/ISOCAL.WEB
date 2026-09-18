import { Link } from "react-router-dom";
import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";

export function AboutNextStepSection() {
    return (
        <section className="ix-compact-cta">
            <div className="public-container ix-compact-cta-grid">
                <div>
                    <p className="ix-kicker ix-kicker-light">Contacto</p>
                    <h2>¿Tienes un requerimiento técnico?</h2>
                </div>
                <Link className="ix-button ix-button-light" to="/contacto">
                    Contactar <CorporateIcon name="arrow" />
                </Link>
            </div>
        </section>
    );
}
