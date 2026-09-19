import { INTEGRATED_POLICY_COMMITMENT, INTEGRATED_POLICY_PRINCIPLES } from "../../data/about";

export function AboutPolicySection() {
    return (
        <section className="ix-section ix-policy ix-policy-final" id="politica">
            <div className="public-container ix-policy-grid">
                <div className="ix-policy-intro">
                    <p className="ix-kicker">Política integrada</p>
                    <h2>Principios de nuestra política integrada.</h2>
                    <p>
                        La política del sistema de gestión ISO/IEC 17025 e ISO 9001 se apoya en
                        principios de competencia, satisfacción, cumplimiento y mejora.
                    </p>
                    <figure>
                        <img src="/images/company/met.webp" alt="Trabajo técnico en laboratorio" loading="lazy" />
                        <figcaption>Política integrada / ISOCAL</figcaption>
                    </figure>
                </div>
                <div className="ix-policy-ledger">
                    {INTEGRATED_POLICY_PRINCIPLES.map((principle) => (
                        <article className="ix-policy-row" key={principle.number}>
                            <span>{principle.number}</span>
                            <div>
                                <h3>{principle.title}</h3>
                                <p>{principle.description}</p>
                            </div>
                        </article>
                    ))}
                    <p className="ix-policy-note">{INTEGRATED_POLICY_COMMITMENT}</p>
                </div>
            </div>
        </section>
    );
}
