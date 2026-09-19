import { PageSeo } from "../../../shared/seo/PageSeo";
import { AboutHeroSection } from "../components/about/AboutHeroSection";
import { AboutNetworkSection } from "../components/about/AboutNetworkSection";
import { AboutNextStepSection } from "../components/about/AboutNextStepSection";
import { AboutOverviewSection } from "../components/about/AboutOverviewSection";
import { AboutPolicySection } from "../components/about/AboutPolicySection";
import { AboutPurposeSection } from "../components/about/AboutPurposeSection";
import { AboutSectorsSection } from "../components/about/AboutSectorsSection";
import { AboutServiceArchitectureSection } from "../components/about/AboutServiceArchitectureSection";

export function AboutPage() {
    return (
        <main className="ix-about-page">
            <PageSeo
                title="Nosotros | ISOCAL"
                description="Conoce el equipo, la red metrológica, las líneas de servicio y la política integrada de ISOCAL."
                canonicalPath="/nosotros"
                image="/images/company/ORIGG.png"
            />
            <AboutHeroSection />
            <AboutOverviewSection />
            <AboutSectorsSection />
            <AboutServiceArchitectureSection />
            <AboutPurposeSection />
            <AboutNetworkSection />
            <AboutPolicySection />
            <AboutNextStepSection />
        </main>
    );
}
