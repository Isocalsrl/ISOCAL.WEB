import {
    ActionLink,
} from "../../../shared/components/ui/ActionLink";

import {
    PageSeo,
} from "../../../shared/seo/PageSeo";

import {
    ContactSection,
} from "../components/ContactSection";

import {
    ServiceAreaNavigation,
} from "../components/services/ServiceAreaNavigation";

import {
    ServiceDisclosureList,
} from "../components/services/ServiceDisclosureList";

import {
    COMPANY,
} from "../data/company";

import {
    AUDIT_DESCRIPTION,
    AUDIT_GROUPS,
    AUDIT_OUTCOME,
    CALIBRATION_GROUPS,
    CONSULTING_DESCRIPTION,
    CONSULTING_OUTCOME,
    CONSULTING_STANDARDS,
    MAINTENANCE_DESCRIPTION,
    MAINTENANCE_ITEMS,
    METROLOGY_DESCRIPTION,
    TESTING_ITEMS,
    TRAINING_GROUPS,
} from "../data/services";

const SERVICES_STRUCTURED_DATA = {
    "@context":
        "https://schema.org",

    "@type":
        "CollectionPage",

    name:
        "Servicios | ISOCAL",

    url:
        `${COMPANY.website}/servicios`,

    description:
        "Servicios de metrología, calibración, mantenimiento, ensayos, consultoría, capacitación y auditoría de ISOCAL.",
};

export function ServicesPage() {
    return (
        <main className="public-main">
            <PageSeo
                title="Servicios de metrología, consultoría y auditoría | ISOCAL"
                description="Servicios de calibración, metrología, mantenimiento, ensayos, consultoría ISO, capacitaciones y auditorías para industria y laboratorios."
                canonicalPath="/servicios"
                image="/images/services/hero-servicios.webp"
                structuredData={
                    SERVICES_STRUCTURED_DATA
                }
            />

            <section
                className="services-hero"
                aria-labelledby="services-hero-title"
            >
                <img
                    className="services-hero-image"
                    src="/images/services/hero-servicios.webp"
                    alt="Especialista trabajando con instrumentos de medición"
                    width="1920"
                    height="1100"
                    fetchPriority="high"
                    decoding="async"
                />

                <div
                    className="services-hero-overlay"
                    aria-hidden="true"
                />

                <div className="public-container services-hero-content">
                    <div className="services-hero-copy">
                        <p className="services-hero-kicker">
                            Servicios · ISOCAL
                        </p>

                        <h1 id="services-hero-title">
                            Capacidad técnica
                            para medir,
                            evaluar y mejorar.
                        </h1>

                        <p className="services-hero-description">
                            Integramos
                            metrología,
                            consultoría y
                            auditoría para
                            responder a
                            necesidades
                            técnicas de la
                            industria y los
                            laboratorios.
                        </p>

                        <ActionLink
                            variant="light"
                            to="/productos"
                        >
                            Explorar productos
                        </ActionLink>
                    </div>
                </div>
            </section>

            <section
                className="services-intro public-section"
                aria-labelledby="services-intro-title"
            >
                <div className="public-container">
                    <div className="services-intro-heading">
                        <div>
                            <p className="eyebrow">
                                Áreas de servicio
                            </p>

                            <h2 id="services-intro-title">
                                Tres áreas
                                conectadas por
                                una misma
                                exigencia:
                                confianza.
                            </h2>
                        </div>

                        <p>
                            Explora cada área
                            para conocer sus
                            alcances,
                            calibraciones,
                            capacitaciones y
                            esquemas de
                            auditoría.
                        </p>
                    </div>

                    <ServiceAreaNavigation />
                </div>
            </section>

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

            <section
                className="services-products-cta"
                aria-labelledby="services-products-title"
            >
                <div className="public-container services-products-cta-grid">
                    <div>
                        <p className="eyebrow">
                            Equipamiento
                        </p>

                        <h2 id="services-products-title">
                            ¿Además necesitas
                            equipos o
                            insumos?
                        </h2>
                    </div>

                    <div className="services-products-cta-action">
                        <p>
                            ISOCAL también
                            comercializa
                            equipamiento para
                            medición,
                            laboratorio,
                            monitoreo y otras
                            necesidades
                            técnicas.
                        </p>

                        <ActionLink
                            variant="dark"
                            to="/productos"
                        >
                            Ver catálogo
                        </ActionLink>
                    </div>
                </div>
            </section>

            <ContactSection />
        </main>
    );
}