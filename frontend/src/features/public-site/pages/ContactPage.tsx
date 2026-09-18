import { PageSeo } from "../../../shared/seo/PageSeo";
import { ContactGuidanceSection } from "../components/contact/ContactGuidanceSection";
import { ContactProcessSection } from "../components/contact/ContactProcessSection";
import { ContactScopeSection } from "../components/contact/ContactScopeSection";
import { ContactWorkspaceSection } from "../components/contact/ContactWorkspaceSection";

export function ContactPage() {
    return (
        <main className="ix-contact-page">
            <PageSeo
                title="Contacto | ISOCAL"
                description="Envía una consulta comercial a ISOCAL sobre servicios, equipos o cotizaciones."
                canonicalPath="/contacto"
            />
            <ContactWorkspaceSection />
            <ContactScopeSection />
            <ContactGuidanceSection />
            <ContactProcessSection />
        </main>
    );
}
