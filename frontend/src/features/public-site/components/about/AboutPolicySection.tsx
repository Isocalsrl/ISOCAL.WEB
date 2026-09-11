import {
    INTEGRATED_POLICY_COMMITMENT,
    INTEGRATED_POLICY_PRINCIPLES,
} from "../../data/about";

export function AboutPolicySection() {
    return (
        <section
            className="about-policy public-section"
            aria-labelledby="about-policy-title"
        >
            <div className="public-container about-policy-grid">
                <div className="about-policy-heading">
                    <div className="about-policy-heading-content">
                        <p className="eyebrow">
                            Política integrada
                        </p>

                        <h2 id="about-policy-title">
                            Calidad,
                            competencia
                            técnica y mejora
                            continua.
                        </h2>

                        <p>
                            En ISOCAL hemos
                            definido la
                            política de
                            nuestro sistema de
                            gestión ISO/IEC
                            17025 e ISO 9001
                            sobre principios
                            que orientan
                            nuestra operación.
                        </p>
                    </div>
                </div>

                <div className="about-policy-content">
                    <div className="about-policy-list">
                        {INTEGRATED_POLICY_PRINCIPLES.map(
                            (
                                principle,
                            ) => (
                                <article
                                    key={
                                        principle.number
                                    }
                                    className="about-policy-item"
                                >
                                    <span className="about-policy-number">
                                        {
                                            principle.number
                                        }
                                    </span>

                                    <div>
                                        <h3>
                                            {
                                                principle.title
                                            }
                                        </h3>

                                        <p>
                                            {
                                                principle.description
                                            }
                                        </p>
                                    </div>
                                </article>
                            ),
                        )}
                    </div>

                    <p className="about-policy-commitment">
                        {
                            INTEGRATED_POLICY_COMMITMENT
                        }
                    </p>
                </div>
            </div>
        </section>
    );
}
