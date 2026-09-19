import { Link } from "react-router-dom";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";
import { COMPANY } from "../data/company";

const socialLinks = [
    { label: "Instagram", href: COMPANY.instagram, icon: "instagram" as const },
    { label: "Facebook", href: COMPANY.facebook, icon: "facebook" as const },
    { label: "YouTube", href: COMPANY.youtube, icon: "youtube" as const },
    { label: "LinkedIn", href: COMPANY.linkedin, icon: "linkedin" as const },
];

export function PublicFooter() {
    return (
        <footer className="ix-footer">
            <div className="public-container">
                <div className="ix-footer-main">
                    <div className="ix-footer-brand">
                        <Link to="/" aria-label="ISOCAL · Inicio">
                            <img src="/images/brand/isocal-logo-white.svg" alt="ISOCAL" />
                        </Link>
                        <p>
                            Servicios de metrología, consultoría, auditoría y equipamiento para industria y laboratorios.
                        </p>
                        <div className="ix-footer-socials" aria-label="Redes sociales de ISOCAL">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    className="ix-footer-social-link"
                                    href={social.href}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <CorporateIcon name={social.icon} />
                                    <span>{social.label}</span>
                                    <CorporateIcon name="external" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="ix-footer-column">
                        <h3>Explorar</h3>
                        <Link to="/nosotros">Nosotros</Link>
                        <Link to="/servicios">Servicios</Link>
                        <Link to="/productos">Productos</Link>
                        <Link to="/blog">Blog</Link>
                        <Link to="/herramientas">Herramientas metrológicas</Link>
                        <Link to="/herramientas#conversores">Conversores de unidades</Link>
                        <Link to="/herramientas#orientador">Orientador de servicios</Link>
                        <Link to="/favoritos">Favoritos</Link>
                        <a
                            className="ix-footer-inline-icon"
                            href="/portfolio/portafolio-isocal-2025.pdf"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <CorporateIcon name="file" /> <span>Portafolio institucional</span>
                        </a>
                    </div>

                    <div className="ix-footer-column">
                        <h3>Contacto</h3>
                        <a className="ix-footer-inline-icon" href={COMPANY.primaryPhoneHref}>
                            <CorporateIcon name="phone" /> <span>{COMPANY.primaryPhone}</span>
                        </a>
                        <a
                            className="ix-footer-inline-icon"
                            href={COMPANY.whatsapp}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <CorporateIcon name="message" /> <span>WhatsApp · {COMPANY.whatsappPhone}</span>
                        </a>
                        <a className="ix-footer-inline-icon" href={COMPANY.salesEmailHref}>
                            <CorporateIcon name="mail" /> <span>{COMPANY.salesEmail}</span>
                        </a>
                    </div>

                    <div className="ix-footer-column">
                        <h3>Empresa</h3>
                        <p>
                            {COMPANY.legalName}
                            <br />
                            RUC: {COMPANY.ruc}
                            <br />
                            {COMPANY.location}
                        </p>
                        <Link to="/nosotros#politica">Política integrada</Link>
                    </div>

                    <div className="ix-footer-help">
                        <h3>Estamos para ayudarte</h3>
                        <Link to="/reclamaciones" className="ix-complaint-link">
                            <img
                                className="ix-complaint-book"
                                src="/images/footer/libro-reclamaciones.png"
                                width="40"
                                height="40"
                                alt=""
                                aria-hidden="true"
                            />
                            <span>
                                Libro de
                                <strong>Reclamaciones</strong>
                            </span>
                            <CorporateIcon name="arrow" />
                        </Link>
                    </div>
                </div>

                <div className="ix-footer-bottom">
                    <span>© {new Date().getFullYear()} ISOCAL. Todos los derechos reservados.</span>
                    <div>
                        <Link to="/privacidad">Privacidad y datos personales</Link>
                        <Link to="/terminos">Términos y condiciones</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
