import {
    PageSeo,
} from "../../../shared/seo/PageSeo";

import {
    AboutHeroSection,
} from "../components/about/AboutHeroSection";

import {
    AboutNetworkSection,
} from "../components/about/AboutNetworkSection";

import {
    AboutNextStepSection,
} from "../components/about/AboutNextStepSection";

import {
    AboutOverviewSection,
} from "../components/about/AboutOverviewSection";

import {
    AboutPolicySection,
} from "../components/about/AboutPolicySection";

import {
    AboutPurposeSection,
} from "../components/about/AboutPurposeSection";

import {
    ContactSection,
} from "../components/ContactSection";

import {
    COMPANY,
} from "../data/company";

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

            <AboutHeroSection />
            <AboutOverviewSection />
            <AboutPurposeSection />
            <AboutPolicySection />
            <AboutNetworkSection />
            <AboutNextStepSection />
            <ContactSection />
        </main>
    );
}
