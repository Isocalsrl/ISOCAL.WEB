import { Link } from "react-router-dom";
import { CorporateIcon } from "../../../../../shared/components/ui/CorporateIcon";
import { MAINTENANCE_ITEMS, TESTING_ITEMS } from "../../../data/services/metrology";

export function ServicesSupportSection() {
    return (
        <section className="ix-support-section" id="mantenimiento">
            <div className="public-container ix-support-grid">
                <div className="ix-support-block ix-support-maintenance">
                    <div className="ix-support-image">
                        <img src="/images/services/mantenimiento.webp" alt="Mantenimiento técnico de equipos" loading="lazy" />
                    </div>
                    <div>
                        <p className="ix-kicker">04 / Mantenimiento</p>
                        <h2>Mantenimiento de equipos</h2>
                        <p>
                            Diagnóstico, mantenimiento preventivo y correctivo para equipos de
                            laboratorio y monitoreo.
                        </p>
                        <ul>
                            {MAINTENANCE_ITEMS.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                        <Link className="ix-inline-link" to="/contacto?servicio=Mantenimiento de equipos">
                            Consultar servicio <CorporateIcon name="arrow" />
                        </Link>
                    </div>
                </div>

                <div className="ix-support-testing" id="ensayos">
                    <div>
                        <p className="ix-kicker">05 / Ensayos</p>
                        <h2>Ensayos y caracterización de ambientes.</h2>
                        <p>
                            Servicios publicados para caracterizar ambientes y condiciones de operación.
                        </p>
                    </div>
                    <div className="ix-testing-grid">
                        {TESTING_ITEMS.map((item, index) => (
                            <article key={item}>
                                <span>{String(index + 1).padStart(2, "0")}</span>
                                <strong>{item}</strong>
                            </article>
                        ))}
                    </div>
                    <Link className="ix-inline-link" to="/contacto?servicio=Ensayos y caracterización">
                        Consultar servicio <CorporateIcon name="arrow" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
