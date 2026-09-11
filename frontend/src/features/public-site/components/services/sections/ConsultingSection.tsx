import {
    CONSULTING_DESCRIPTION,
    CONSULTING_OUTCOME,
    CONSULTING_STANDARDS,
    TRAINING_GROUPS,
} from "../../../data/services";

import {
    ServiceDisclosureList,
} from "../ServiceDisclosureList";

export function ConsultingSection() {
    return (
        <section
            id="consultoria"
            className="services-area services-consulting"
            aria-labelledby="services-consulting-title"
        >
            <div className="public-container">
                <div className="services-consulting-grid">
                    <div className="services-consulting-copy">
                        <p className="services-area-number">
                            02
                        </p>

                        <p className="eyebrow">
                            Consultoría
                        </p>

                        <h2 id="services-consulting-title">
                            De los
                            requisitos a
                            una ruta de
                            implementación
                            clara.
                        </h2>

                        <p className="services-lead">
                            {
                                CONSULTING_DESCRIPTION
                            }
                        </p>

                        <p className="services-consulting-outcome">
                            {
                                CONSULTING_OUTCOME
                            }
                        </p>
                    </div>

                    <div className="services-consulting-image">
                        <img
                            src="/images/services/consultoria-detalle.webp"
                            alt="Consultoría técnica y revisión de sistemas de gestión"
                            width="1400"
                            height="1000"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                </div>

                <div className="services-standards">
                    <p>
                        Normativas
                        consideradas en
                        el portafolio
                    </p>

                    <div className="services-standards-list">
                        {CONSULTING_STANDARDS.map(
                            (
                                standard,
                                index,
                            ) => (
                                <div
                                    key={
                                        standard
                                    }
                                    className="services-standard-item"
                                >
                                    <span>
                                        {String(
                                            index +
                                                1,
                                        ).padStart(
                                            2,
                                            "0",
                                        )}
                                    </span>

                                    <strong>
                                        {
                                            standard
                                        }
                                    </strong>
                                </div>
                            ),
                        )}
                    </div>
                </div>

                <div className="services-training">
                    <div className="services-section-heading">
                        <div>
                            <p className="eyebrow">
                                Capacitaciones
                            </p>

                            <h3>
                                Formación
                                técnica para
                                laboratorios y
                                sistemas de
                                gestión.
                            </h3>
                        </div>

                        <p>
                            El portafolio
                            contempla
                            interpretación
                            de normas,
                            herramientas
                            metrológicas,
                            aseguramiento de
                            resultados y
                            procedimientos
                            específicos de
                            calibración.
                        </p>
                    </div>

                    <ServiceDisclosureList
                        groups={
                            TRAINING_GROUPS
                        }
                        defaultOpenCount={
                            1
                        }
                    />
                </div>
            </div>
        </section>
    );
}
