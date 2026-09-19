import { PageSeo } from "../../../shared/seo/PageSeo";
import { HomeAboutSection } from "../components/home/HomeAboutSection";
import { HomeAdvisorSection } from "../components/home/HomeAdvisorSection";
import { HomeAssuranceSection } from "../components/home/HomeAssuranceSection";
import { HomeBlogSection } from "../components/home/HomeBlogSection";
import { HomeCapabilitySection } from "../components/home/HomeCapabilitySection";
import { HomeCatalogSection } from "../components/home/HomeCatalogSection";
import { HomeFinalCtaSection } from "../components/home/HomeFinalCtaSection";
import { HomeHeroSection } from "../components/home/HomeHeroSection";
import { HomeNetworkSection } from "../components/home/HomeNetworkSection";
import { HomeSearchSection } from "../components/home/HomeSearchSection";
import { HomeSectorStrip } from "../components/home/HomeSectorStrip";
import { HomeServicesSection } from "../components/home/HomeServicesSection";
import { HomeTestimonialsSection } from "../components/home/HomeTestimonialsSection";

export function HomePage() {
    return (
        <main className="ix-home">
            <PageSeo
                title="ISOCAL | Metrología, consultoría y equipamiento"
                description="Servicios de metrología, consultoría, auditoría y equipamiento para industria y laboratorios."
                canonicalPath="/"
                image="/images/company/ORIGG.png"
            />
            <HomeHeroSection />
            <HomeSearchSection />
            <HomeSectorStrip />
            <HomeAssuranceSection />
            <HomeServicesSection />
            <HomeCapabilitySection />
            <HomeAdvisorSection />
            <HomeAboutSection />
            <HomeNetworkSection />
            <HomeCatalogSection />
            <HomeBlogSection />
            <HomeTestimonialsSection />
            <HomeFinalCtaSection />
        </main>
    );
}
