import {
    CALIBRATION_GROUPS,
    MAINTENANCE_DESCRIPTION,
    MAINTENANCE_ITEMS,
    METROLOGY_DESCRIPTION,
    TESTING_ITEMS,
} from "../../../data/services";

import {
    ServiceDisclosureList,
} from "../ServiceDisclosureList";

export function MetrologySection() {
    return (
        <section
            id="metrologia"
            className="services-area services-metrology"
            aria-labelledby="services-metrology-title"
        >
            <div className="public-container">
                <div className="services-editorial-grid">
                    <div className="services-editorial-image">
                        <img
                            src="/images/services/metrologia-detalle.webp"
                            alt="Proceso técnico de calibración de instrumentos"
                            width="1400"
                            height="1050"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>

                    <div className="services-editorial-copy">
                        <p className="services-area-number">
                            01
                        </p>

                        <p className="eyebrow">
                            Metrología
                        </p>

                        <h2 id="services-metrology-title">
                            Mediciones
                            respaldadas por
                            capacidad
                            técnica.
                        </h2>

                        <p className="services-lead">
                            {
                                METROLOGY_DESCRIPTION
                            }
                        </p>

                        <div className="services-standard-line">
                            <span>
                                Referencia
                            </span>

                            <strong>
                                ISO 17025
                            </strong>
                        </div>
                    </div>
                </div>

                <div
                    className="services-calibrations"
                    aria-labelledby="services-calibration-title"
                >
                    <div className="services-section-heading">
                        <div>
                            <p className="eyebrow">
                                Calibraciones
                            </p>

                            <h3 id="services-calibration-title">
                                Equipos e
                                instrumentos
                                que podemos
                                atender.
                            </h3>
                        </div>

                        <p>
                            Selecciona una
                            magnitud para
                            revisar los
                            equipos
                            incluidos en el
                            portafolio de
                            servicios.
                        </p>
                    </div>

                    <ServiceDisclosureList
                        groups={
                            CALIBRATION_GROUPS
                        }
                        defaultOpenCount={
                            2
                        }
                    />
                </div>

                <div className="services-support-grid">
                    <article className="services-support-item">
                        <div className="services-support-image">
                            <img
                                src="/images/services/mantenimiento.webp"
                                alt="Mantenimiento y diagnóstico de equipos técnicos"
                                width="1200"
                                height="900"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>

                        <div className="services-support-content">
                            <p className="eyebrow">
                                Mantenimiento
                            </p>

                            <h3>
                                Diagnóstico,
                                mantenimiento
                                preventivo y
                                correctivo.
                            </h3>

                            <p>
                                {
                                    MAINTENANCE_DESCRIPTION
                                }
                            </p>

                            <ul>
                                {MAINTENANCE_ITEMS.map(
                                    (
                                        item,
                                    ) => (
                                        <li
                                            key={
                                                item
                                            }
                                        >
                                            {
                                                item
                                            }
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    </article>

                    <article className="services-support-item">
                        <div className="services-support-image">
                            <img
                                src="/images/services/ensayos.webp"
                                alt="Ensayos y evaluación de ambientes técnicos"
                                width="1200"
                                height="900"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>

                        <div className="services-support-content">
                            <p className="eyebrow">
                                Ensayos
                            </p>

                            <h3>
                                Evaluación de
                                ambientes y
                                condiciones
                                técnicas.
                            </h3>

                            <ul>
                                {TESTING_ITEMS.map(
                                    (
                                        item,
                                    ) => (
                                        <li
                                            key={
                                                item
                                            }
                                        >
                                            {
                                                item
                                            }
                                        </li>
                                    ),
                                )}
                            </ul>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}
