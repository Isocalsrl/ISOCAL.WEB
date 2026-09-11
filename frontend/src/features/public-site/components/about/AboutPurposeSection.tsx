import {
    COMPANY,
} from "../../data/company";

export function AboutPurposeSection() {
    return (
        <section
            className="about-purpose"
            aria-labelledby="about-purpose-title"
        >
            <div className="public-container">
                <div className="about-purpose-heading">
                    <p className="eyebrow">
                        Dirección
                        institucional
                    </p>

                    <h2 id="about-purpose-title">
                        La razón que orienta
                        nuestro trabajo y el
                        futuro que buscamos
                        construir.
                    </h2>
                </div>

                <div className="about-purpose-grid">
                    <article className="about-purpose-item about-mission">
                        <span className="about-purpose-number">
                            01
                        </span>

                        <div>
                            <p className="about-purpose-label">
                                Misión
                            </p>

                            <h3>
                                Soluciones
                                integrales para
                                necesidades
                                metrológicas.
                            </h3>

                            <p className="about-purpose-description">
                                {
                                    COMPANY.mission
                                }
                            </p>
                        </div>
                    </article>

                    <article className="about-purpose-item about-vision">
                        <span className="about-purpose-number">
                            02
                        </span>

                        <div>
                            <p className="about-purpose-label">
                                Visión
                            </p>

                            <h3>
                                Ser un socio
                                experto y
                                confiable.
                            </h3>

                            <p className="about-purpose-description">
                                {
                                    COMPANY.vision
                                }
                            </p>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}
