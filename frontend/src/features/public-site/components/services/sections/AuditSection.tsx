import {
    AUDIT_DESCRIPTION,
    AUDIT_GROUPS,
    AUDIT_OUTCOME,
} from "../../../data/services";

export function AuditSection() {
    return (
        <>
            <section
                id="auditoria"
                className="services-area services-audit"
                aria-labelledby="services-audit-title"
            >
                <div className="public-container services-audit-intro">
                    <div className="services-audit-image">
                        <img
                            src="/images/services/auditoria-detalle.webp"
                            alt="Revisión de documentos y evidencias durante una auditoría"
                            width="1400"
                            height="1000"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>

                    <div className="services-audit-copy">
                        <p className="services-area-number services-area-number-light">
                            03
                        </p>

                        <p className="eyebrow eyebrow-light">
                            Auditoría
                        </p>

                        <h2 id="services-audit-title">
                            Evaluaciones que
                            convierten
                            evidencias en
                            oportunidades de
                            mejora.
                        </h2>

                        <p>
                            {
                                AUDIT_DESCRIPTION
                            }
                        </p>

                        <p className="services-audit-outcome">
                            {
                                AUDIT_OUTCOME
                            }
                        </p>
                    </div>
                </div>
            </section>

            <section
                className="services-audit-schemes public-section"
                aria-labelledby="services-audit-schemes-title"
            >
                <div className="public-container">
                    <div className="services-section-heading">
                        <div>
                            <p className="eyebrow">
                                Esquemas de
                                auditoría
                            </p>

                            <h2 id="services-audit-schemes-title">
                                Diagnóstico e
                                auditoría
                                interna.
                            </h2>
                        </div>

                        <p>
                            Los esquemas
                            contemplados en el
                            portafolio cubren
                            sistemas de
                            gestión,
                            laboratorios e
                            inspección.
                        </p>
                    </div>

                    <div className="services-audit-groups">
                        {AUDIT_GROUPS.map(
                            (
                                group,
                                groupIndex,
                            ) => (
                                <article
                                    key={
                                        group.id
                                    }
                                    className="services-audit-group"
                                >
                                    <div className="services-audit-group-heading">
                                        <span>
                                            {String(
                                                groupIndex +
                                                    1,
                                            ).padStart(
                                                2,
                                                "0",
                                            )}
                                        </span>

                                        <h3>
                                            {
                                                group.title
                                            }
                                        </h3>
                                    </div>

                                    <ul>
                                        {group.items.map(
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
                                </article>
                            ),
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
