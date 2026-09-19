import { Link, useSearchParams } from "react-router-dom";
import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";
import { RequestForm } from "../../../requests/components/RequestForm";
import { COMPANY } from "../../data/company";

const socialLinks = [
    { label: "Instagram", href: COMPANY.instagram, icon: "instagram" as const },
    { label: "Facebook", href: COMPANY.facebook, icon: "facebook" as const },
    { label: "YouTube", href: COMPANY.youtube, icon: "youtube" as const },
    { label: "LinkedIn", href: COMPANY.linkedin, icon: "linkedin" as const },
];

export function ContactWorkspaceSection() {
    const [params] = useSearchParams();
    const advisorContext = [
        params.get("servicio") ? `Solicito información sobre ${params.get("servicio")}.` : "",
        params.get("equipo") ? `Equipo: ${params.get("equipo")}.` : "",
        params.get("rango") ? `Rango indicado: ${params.get("rango")}.` : "",
    ]
        .filter(Boolean)
        .join("\n");

    return (
        <section className="ix-contact-workspace">
            <div className="public-container ix-contact-workspace-grid">
                <aside className="ix-contact-aside">
                    <p className="ix-breadcrumb">
                        <Link to="/">Inicio</Link> <span>/</span> Contacto
                    </p>
                    <p className="ix-kicker">Contacto</p>
                    <h1>Cuéntanos qué necesitas.</h1>
                    <p className="ix-contact-intro">
                        Indica el equipo, servicio o necesidad. Te responderemos por el canal comercial correspondiente.
                    </p>

                    <div className="ix-contact-channel-list">
                        <a href={COMPANY.primaryPhoneHref}>
                            <CorporateIcon name="phone" />
                            <div>
                                <small>Teléfono</small>
                                <strong>{COMPANY.primaryPhone}</strong>
                            </div>
                            <CorporateIcon name="arrow" />
                        </a>
                        <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer">
                            <CorporateIcon name="message" />
                            <div>
                                <small>WhatsApp</small>
                                <strong>{COMPANY.whatsappPhone}</strong>
                            </div>
                            <CorporateIcon name="arrow" />
                        </a>
                        <a href={COMPANY.salesEmailHref}>
                            <CorporateIcon name="mail" />
                            <div>
                                <small>Correo comercial</small>
                                <strong>{COMPANY.salesEmail}</strong>
                            </div>
                            <CorporateIcon name="arrow" />
                        </a>
                    </div>

                    <div className="ix-contact-socials" aria-label="Redes sociales de ISOCAL">
                        <span>Síguenos</span>
                        <div>
                            {socialLinks.map((social) => (
                                <a key={social.label} href={social.href} target="_blank" rel="noreferrer">
                                    <CorporateIcon name={social.icon} />
                                    <span>{social.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="ix-contact-photo">
                        <img src="/images/editorial/equipo-contacto.webp" alt="Equipo de ISOCAL" />
                    </div>

                    <div className="ix-contact-corporate-data">
                        <strong>{COMPANY.legalName}</strong>
                        <span>RUC: {COMPANY.ruc}</span>
                        <span>{COMPANY.location}</span>
                    </div>
                </aside>

                <div className="ix-contact-form-panel">
                    <div className="ix-contact-form-head">
                        <span>Solicitud comercial</span>
                        <strong>Respuesta por correo</strong>
                    </div>
                    <RequestForm key={params.toString()} subject={advisorContext} />
                </div>
            </div>
        </section>
    );
}
