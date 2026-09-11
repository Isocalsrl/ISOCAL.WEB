import {
    PageSeo,
} from "../../../shared/seo/PageSeo";

import {
    ContactSection,
} from "../components/ContactSection";

import {
    HomeHeroSection,
} from "../components/home/HomeHeroSection";

import {
    HomeIndustriesSection,
} from "../components/home/HomeIndustriesSection";

import {
    HomeIntroSection,
} from "../components/home/HomeIntroSection";

import {
    HomeNetworkSection,
} from "../components/home/HomeNetworkSection";

import {
    HomeProductsSection,
} from "../components/home/HomeProductsSection";

import {
    HomeServicesSection,
} from "../components/home/HomeServicesSection";

import {
    COMPANY,
} from "../data/company";

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

            <HomeHeroSection />
            <HomeIntroSection />
            <HomeServicesSection />
            <HomeNetworkSection />
            <HomeIndustriesSection />
            <HomeProductsSection />
            <ContactSection />
        </main>
    );
}
