import { Link } from "react-router-dom";
import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";

export function HomeFinalCtaSection() {
    return (
        <section className="ix-home-final-cta">
            <div className="public-container ix-home-final-cta-grid">
                <div>
                    <p className="ix-kicker ix-kicker-light">Contacto técnico</p>
                    <h2>Cuéntanos qué necesitas medir o equipar.</h2>
                </div>
                <div>
                    <p>
                        Indica el equipo, la magnitud o el servicio y te ayudamos a ubicar la opción adecuada.
                    </p>
                    <Link className="ix-button ix-button-light" to="/contacto">
                        Contactar <CorporateIcon name="arrow" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
