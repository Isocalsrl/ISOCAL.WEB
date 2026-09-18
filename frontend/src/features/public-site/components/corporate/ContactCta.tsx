import { Link } from "react-router-dom";
import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";

export function ContactCta() {
    return (
        <section className="co-cta">
            <div className="public-container co-cta-inner">
                <div>
                    <span className="co-eyebrow">Hablemos de tu próximo proyecto</span>
                    <h2>La precisión empieza<br />con una buena conversación.</h2>
                    <p>Cuéntanos qué necesitas. Te acompañamos a encontrar la solución.</p>
                </div>
                <Link className="co-button co-button-white" to="/contacto">
                    Conversemos <CorporateIcon name="arrow" />
                </Link>
            </div>
        </section>
    );
}
