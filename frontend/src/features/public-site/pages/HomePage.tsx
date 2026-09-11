import {
    Link,
} from "react-router-dom";

import {
    PageSeo,
} from "../../../shared/seo/PageSeo";

import {
    ActionLink,
} from "../../../shared/components/ui/ActionLink";

import {
    ArrowIcon,
} from "../../../shared/components/ui/ArrowIcon";

import {
    ContactSection,
} from "../components/ContactSection";

import {
    ServicePreviewCard,
} from "../components/ServicePreviewCard";

import {
    COMPANY,
} from "../data/company";

import {
    HOME_INDUSTRIES,
    HOME_SERVICE_PREVIEWS,
} from "../data/home";

const HOME_STRUCTURED_DATA = {
    "@context":
        "https://schema.org",

    "@type":
        "Organization",

    name:
        COMPANY.name,

    url:
        COMPANY.website,

    logo:
        `${COMPANY.website}/images/brand/isocal-logo.svg`,

    email:
        COMPANY.salesEmail,

    telephone:
        COMPANY.primaryPhone,

    description:
        "Red metrológica enfocada en servicios integrales de metrología, consultoría y auditoría para la industria.",
};

export function HomePage() {
    return (
        <main className="public-main">
            <PageSeo
                title="ISOCAL | Metrología, consultoría y auditoría"
                description="ISOCAL brinda soluciones integrales de metrología, calibración, consultoría, auditoría y equipamiento para minería, manufactura y laboratorios."
                canonicalPath="/"
                image="/images/home/hero-equipo-isocal.webp"
                structuredData={
                    HOME_STRUCTURED_DATA
                }
            />

            <section
                className="home-hero"
                aria-labelledby="home-hero-title"
            >
                <img
                    className="home-hero-image"
                    src="/images/home/hero-equipo-isocal.webp"
                    alt="Equipo de ISOCAL"
                    width="1920"
                    height="1200"
                    fetchPriority="high"
                    decoding="async"
                />

                <div
                    className="home-hero-overlay"
                    aria-hidden="true"
                />

                <div className="public-container home-hero-content">
                    <div className="home-hero-copy">
                        <p className="home-hero-kicker">
                            Red metrológica ·
                            Industria y
                            laboratorios
                        </p>

                        <h1 id="home-hero-title">
                            Mediciones que
                            mejoran decisiones.
                        </h1>

                        <p className="home-hero-description">
                            Servicios integrales
                            de metrología,
                            consultoría y
                            auditoría para
                            organizaciones que
                            necesitan confianza
                            en sus mediciones y
                            procesos.
                        </p>

                        <div className="home-hero-actions">
                            <ActionLink
                                to="/servicios"
                            >
                                Conocer servicios
                            </ActionLink>

                            <ActionLink
                                variant="light"
                                to="/productos"
                            >
                                Ver productos
                            </ActionLink>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="home-intro public-section"
                aria-labelledby="home-intro-title"
            >
                <div className="public-container home-intro-grid">
                    <div>
                        <p className="eyebrow">
                            Quiénes somos
                        </p>

                        <h2 id="home-intro-title">
                            Una red metrológica
                            para necesidades
                            técnicas que exigen
                            confianza.
                        </h2>
                    </div>

                    <div className="home-intro-copy">
                        <p>
                            ISOCAL es una red
                            metrológica compuesta
                            por laboratorios
                            acreditados por
                            INACAL, A2LA y PJLA,
                            enfocada en brindar
                            servicios integrales
                            de metrología para
                            minería, manufactura
                            y laboratorios.
                        </p>

                        <Link
                            className="home-text-link"
                            to="/nosotros"
                        >
                            Conocer ISOCAL

                            <ArrowIcon />
                        </Link>
                    </div>
                </div>
            </section>

            <section
                className="home-services public-section"
                aria-labelledby="home-services-title"
            >
                <div className="public-container">
                    <div className="home-section-heading">
                        <div>
                            <p className="eyebrow">
                                Nuestros servicios
                            </p>

                            <h2 id="home-services-title">
                                Tres áreas, una
                                misma exigencia
                                técnica.
                            </h2>
                        </div>

                        <p>
                            Integramos servicios
                            de metrología,
                            consultoría y
                            auditoría para
                            acompañar a las
                            organizaciones desde
                            la medición hasta la
                            mejora de sus sistemas
                            de gestión.
                        </p>
                    </div>

                    <div className="home-services-grid">
                        {HOME_SERVICE_PREVIEWS.map(
                            (
                                service,
                            ) => (
                                <ServicePreviewCard
                                    key={
                                        service.id
                                    }
                                    service={
                                        service
                                    }
                                />
                            ),
                        )}
                    </div>
                </div>
            </section>

            <section
                className="home-network"
                aria-labelledby="home-network-title"
            >
                <div className="public-container home-network-grid">
                    <div className="home-network-image">
                        <img
                            src="/images/home/red-metrologica.webp"
                            alt="Laboratorio e instrumentos de medición asociados a la red metrológica de ISOCAL"
                            width="1200"
                            height="1000"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>

                    <div className="home-network-copy">
                        <p className="eyebrow eyebrow-light">
                            Red metrológica
                        </p>

                        <h2 id="home-network-title">
                            Capacidad técnica
                            conectada para
                            responder mejor.
                        </h2>

                        <p>
                            ISOCAL ha integrado a
                            su red metrológica
                            laboratorios
                            acreditados y
                            especializados con el
                            objetivo de ampliar
                            el valor entregado a
                            sus clientes.
                        </p>

                        <div className="home-accreditation-line">
                            <span>
                                Laboratorios
                                acreditados por
                            </span>

                            <strong>
                                INACAL · A2LA ·
                                PJLA
                            </strong>
                        </div>

                        <Link
                            className="home-text-link home-text-link-light"
                            to="/nosotros"
                        >
                            Ver nuestra
                            organización

                            <ArrowIcon />
                        </Link>
                    </div>
                </div>
            </section>

            <section
                className="home-industries public-section"
                aria-labelledby="home-industries-title"
            >
                <div className="public-container">
                    <div className="home-section-heading home-section-heading-compact">
                        <div>
                            <p className="eyebrow">
                                Sectores atendidos
                            </p>

                            <h2 id="home-industries-title">
                                Metrología aplicada
                                al entorno real de
                                cada operación.
                            </h2>
                        </div>
                    </div>

                    <div className="home-industries-grid">
                        {HOME_INDUSTRIES.map(
                            (
                                industry,
                            ) => (
                                <article
                                    key={
                                        industry.number
                                    }
                                    className="home-industry-item"
                                >
                                    <span>
                                        {
                                            industry.number
                                        }
                                    </span>

                                    <h3>
                                        {
                                            industry.title
                                        }
                                    </h3>

                                    <p>
                                        {
                                            industry.description
                                        }
                                    </p>
                                </article>
                            ),
                        )}
                    </div>
                </div>
            </section>

            <section
                className="home-products"
                aria-labelledby="home-products-title"
            >
                <div className="public-container home-products-grid">
                    <div className="home-products-image">
                        <img
                            src="/images/home/equipos-insumos.webp"
                            alt="Equipos e instrumentos de medición comercializados por ISOCAL"
                            width="1200"
                            height="900"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>

                    <div className="home-products-copy">
                        <p className="eyebrow">
                            Equipos e insumos
                        </p>

                        <h2 id="home-products-title">
                            Equipamiento para
                            medir, monitorear y
                            trabajar con mayor
                            control.
                        </h2>

                        <p>
                            ISOCAL complementa sus
                            servicios con venta
                            de equipos e insumos
                            para medición,
                            laboratorio, monitoreo
                            y otras necesidades
                            técnicas de la
                            industria.
                        </p>

                        <ActionLink
                            to="/productos"
                        >
                            Explorar catálogo
                        </ActionLink>
                    </div>
                </div>
            </section>

            <ContactSection />
        </main>
    );
}
