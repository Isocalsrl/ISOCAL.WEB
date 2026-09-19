import { PageSeo } from "../../../shared/seo/PageSeo";
import { ServiceNavigation } from "../components/ServiceNavigation";
import { AuditSection } from "../components/services/sections/AuditSection";
import { ConsultingSection } from "../components/services/sections/ConsultingSection";
import { MetrologySection } from "../components/services/sections/MetrologySection";
import { ServicesAdvisorSection } from "../components/services/sections/ServicesAdvisorSection";
import { ServicesHeroSection } from "../components/services/sections/ServicesHeroSection";
import { ServicesProductsCtaSection } from "../components/services/sections/ServicesProductsCtaSection";
import { ServicesSupportSection } from "../components/services/sections/ServicesSupportSection";

export function ServicesPage() {
    return (
        <main className="ix-services-page">
            <PageSeo
                title="Servicios | ISOCAL"
                description="Calibración, mantenimiento, ensayos, consultoría, capacitación y auditoría para la industria."
                canonicalPath="/servicios"
                image="/images/services/hero-servicios.webp"
            />
            <ServicesHeroSection />
            <ServiceNavigation />
            <ServicesAdvisorSection />
            <MetrologySection />
            <ConsultingSection />
            <AuditSection />
            <ServicesSupportSection />
            <ServicesProductsCtaSection />
        </main>
    );
}
