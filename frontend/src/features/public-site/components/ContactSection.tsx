import { Link } from "react-router-dom";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";

export function ContactSection() {
    return (
        <section className="ix-catalog-cta">
            <div className="public-container ix-catalog-cta-grid">
                <div>
                    <p className="ix-kicker">¿No encuentras el equipo?</p>
                    <h2>Cuéntanos qué necesitas medir o equipar.</h2>
                    <p>
                        Indica el equipo, la magnitud o el uso previsto y revisaremos las opciones del portafolio.
                    </p>
                </div>
                <Link className="ix-button ix-button-primary" to="/contacto">
                    Contactar <CorporateIcon name="arrow" />
                </Link>
            </div>
        </section>
    );
}
