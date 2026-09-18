import { Link } from "react-router-dom";
import { CorporateIcon } from "../../../../../shared/components/ui/CorporateIcon";
import { CONSULTING_STANDARDS, TRAINING_GROUPS } from "../../../data/services/consulting";

export function ConsultingSection() {
    return (
        <section className="ix-consulting-section" id="consultoria">
            <div className="public-container ix-consulting-grid">
                <div className="ix-consulting-media">
                    <img src="/images/services/consultoria.webp" alt="Sesión de consultoría técnica" loading="lazy" />
                </div>
                <div className="ix-consulting-copy">
                    <p className="ix-kicker">02 / Consultoría y capacitación</p>
                    <h2>Consultoría y capacitación en normas ISO.</h2>
                    <p>
                        Acompañamiento para implementación, capacitación y preparación de sistemas de gestión según las normas publicadas en el portafolio.
                    </p>
                    <div className="ix-standard-index">
                        {CONSULTING_STANDARDS.map((standard, index) => (
                            <span key={standard}>
                                <small>{String(index + 1).padStart(2, "0")}</small>
                                {standard}
                            </span>
                        ))}
                    </div>
                    <Link className="ix-button ix-button-primary" to="/contacto?servicio=Consultoría y capacitación">
                        Consultar servicio <CorporateIcon name="arrow" />
                    </Link>
                </div>
            </div>
            <div className="public-container ix-training-ledger">
                <div>
                    <p className="ix-kicker">Formación técnica</p>
                    <h3>Capacitaciones disponibles</h3>
                </div>
                <div>
                    {TRAINING_GROUPS.map((group) => (
                        <details className="ix-training-disclosure" key={group.id}>
                            <summary>
                                {group.title} <CorporateIcon name="plus" />
                            </summary>
                            <ul>
                                {group.items.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
