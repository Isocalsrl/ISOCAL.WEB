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
    COMPANY,
} from "../data/company";

import {
    ABOUT_ACCREDITATION_BODIES,
    ABOUT_OVERVIEW,
    INTEGRATED_POLICY_COMMITMENT,
    INTEGRATED_POLICY_PRINCIPLES,
    LABORATORY_NETWORK_DESCRIPTION,
    LABORATORY_PARTNERS,
} from "../data/about";

const ABOUT_STRUCTURED_DATA = {
    "@context":
        "https://schema.org",

    "@type":
        "AboutPage",

    name:
        "Nosotros | ISOCAL",

    url:
        `${COMPANY.website}/nosotros`,

    description:
        "Información institucional de ISOCAL, su misión, visión, política integrada y red metrológica.",
};

export function AboutPage() {
    return (
        <main className="public-main">
            <PageSeo
                title="Nosotros | ISOCAL — Red metrológica"
                description="Conoce ISOCAL, nuestra red metrológica, misión, visión, política integrada y compromiso con la competencia técnica, calidad y mejora continua."
                canonicalPath="/nosotros"
                image="/images/about/hero-nosotros.webp"
                structuredData={
                    ABOUT_STRUCTURED_DATA
                }
            />

            <section
                className="about-hero"
                aria-labelledby="about-hero-title"
            >
                <img
                    className="about-hero-image"
                    src="/images/about/hero-nosotros.webp"
                    alt="Equipo de ISOCAL"
                    width="1920"
                    height="1100"
                    fetchPriority="high"
                    decoding="async"
                />

                <div
                    className="about-hero-overlay"
                    aria-hidden="true"
                />

                <div className="public-container about-hero-content">
                    <div className="about-hero-copy">
                        <p className="about-hero-kicker">
                            Nosotros · ISOCAL
                        </p>

                        <h1 id="about-hero-title">
                            Una red metrológica
                            al servicio de la
                            industria.
                        </h1>

                        <p className="about-hero-description">
                            Integramos
                            conocimiento,
                            capacidad técnica y
                            laboratorios
                            acreditados para
                            responder a las
                            necesidades
                            metrológicas de
                            nuestros clientes.
                        </p>
                    </div>
                </div>
            </section>

            <section
                className="about-overview public-section"
                aria-labelledby="about-overview-title"
            >
                <div className="public-container about-overview-grid">
                    <div className="about-overview-heading">
                        <p className="eyebrow">
                            ¿Quiénes somos?
                        </p>

                        <h2 id="about-overview-title">
                            Metrología integral
                            para operaciones que
                            necesitan confianza
                            en sus mediciones.
                        </h2>
                    </div>

                    <div className="about-overview-content">
                        <p>
                            {ABOUT_OVERVIEW}
                        </p>

                        <div
                            className="about-accreditations"
                            aria-label="Entidades de acreditación mencionadas por ISOCAL"
                        >
                            <span>
                                Laboratorios
                                acreditados por
                            </span>

                            <div>
                                {ABOUT_ACCREDITATION_BODIES.map(
                                    (
                                        accreditation,
                                    ) => (
                                        <strong
                                            key={
                                                accreditation
                                            }
                                        >
                                            {
                                                accreditation
                                            }
                                        </strong>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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

            <section
                className="about-network"
                aria-labelledby="about-network-title"
            >
                <div className="public-container about-network-grid">
                    <div className="about-network-image">
                        <img
                            src="/images/about/laboratorio-red.webp"
                            alt="Laboratorio de la red metrológica de ISOCAL"
                            width="1400"
                            height="1000"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>

                    <div className="about-network-content">
                        <p className="eyebrow eyebrow-light">
                            Alianza comercial
                        </p>

                        <h2 id="about-network-title">
                            Una red creada para
                            ampliar nuestra
                            capacidad de
                            respuesta.
                        </h2>

                        <p className="about-network-description">
                            {
                                LABORATORY_NETWORK_DESCRIPTION
                            }
                        </p>

                        <div className="about-network-partners">
                            <p>
                                Red de laboratorios
                            </p>

                            <div className="about-partner-grid">
                                {LABORATORY_PARTNERS.map(
                                    (
                                        partner,
                                    ) => (
                                        <div
                                            key={
                                                partner.id
                                            }
                                            className="about-partner"
                                        >
                                            <img
                                                src={
                                                    partner.logo
                                                }
                                                alt={
                                                    partner.logoAlt
                                                }
                                                width="220"
                                                height="90"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="about-next-step"
                aria-labelledby="about-next-step-title"
            >
                <div className="public-container about-next-step-grid">
                    <div>
                        <p className="eyebrow">
                            Servicios
                        </p>

                        <h2 id="about-next-step-title">
                            Conoce cómo esta
                            capacidad técnica se
                            convierte en
                            soluciones para tu
                            empresa.
                        </h2>
                    </div>

                    <div className="about-next-step-action">
                        <p>
                            Explora nuestras
                            soluciones de
                            metrología,
                            consultoría y
                            auditoría.
                        </p>

                        <ActionLink
                            to="/servicios"
                        >
                            Ver servicios
                        </ActionLink>
                    </div>
                </div>
            </section>

            <ContactSection />
        </main>
    );
}