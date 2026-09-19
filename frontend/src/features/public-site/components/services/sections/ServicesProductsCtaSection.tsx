import { Link } from "react-router-dom";
import { CorporateIcon } from "../../../../../shared/components/ui/CorporateIcon";

export function ServicesProductsCtaSection() {
    return (
        <section className="ix-service-final-cta">
            <div className="public-container ix-service-final-cta-grid">
                <div>
                    <p className="ix-kicker ix-kicker-light">¿No encuentras tu servicio?</p>
                    <h2>Cuéntanos qué equipo necesitas atender.</h2>
                </div>
                <Link className="ix-button ix-button-light" to="/contacto">
                    Consultar servicio <CorporateIcon name="arrow" />
                </Link>
            </div>
        </section>
    );
}
