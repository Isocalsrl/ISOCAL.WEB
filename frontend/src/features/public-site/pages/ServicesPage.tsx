import {
    PageSeo,
} from "../../../shared/seo/PageSeo";

import {
    ContactSection,
} from "../components/ContactSection";

import {
    AuditSection,
} from "../components/services/sections/AuditSection";

import {
    ConsultingSection,
} from "../components/services/sections/ConsultingSection";

import {
    MetrologySection,
} from "../components/services/sections/MetrologySection";

import {
    ServicesHeroSection,
} from "../components/services/sections/ServicesHeroSection";

import {
    ServicesIntroSection,
} from "../components/services/sections/ServicesIntroSection";

import {
    ServicesProductsCtaSection,
} from "../components/services/sections/ServicesProductsCtaSection";

import {
    COMPANY,
} from "../data/company";

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

            <ServicesHeroSection />
            <ServicesIntroSection />
            <MetrologySection />
            <ConsultingSection />
            <AuditSection />
            <ServicesProductsCtaSection />
            <ContactSection />
        </main>
    );
}
