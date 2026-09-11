import {
    COMPANY,
    contactUrl,
} from "../data/company";

export function ContactSection() {
    return (
        <section
            className="public-contact-section"
            id="contacto"
            aria-labelledby="public-contact-title"
        >
            <div className="public-container public-contact-grid">
                <div className="public-contact-copy">
                    <p className="eyebrow">
                        Contacto
                    </p>

                    <h2 id="public-contact-title">
                        Conversemos sobre la
                        necesidad técnica de tu
                        empresa.
                    </h2>

                    <p>
                        Cuéntanos qué necesitas
                        calibrar, evaluar,
                        implementar o mejorar. El
                        equipo de ISOCAL podrá
                        orientarte hacia el
                        servicio adecuado.
                    </p>
                </div>

                <div className="public-contact-actions">
                    <a
                        className="ui-button ui-button-primary"
                        href={contactUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Consultar por WhatsApp
                    </a>

                    <div className="public-contact-details">
                        <a
                            href={
                                COMPANY.primaryPhoneHref
                            }
                        >
                            {
                                COMPANY.primaryPhone
                            }
                        </a>

                        <a
                            href={
                                COMPANY.salesEmailHref
                            }
                        >
                            {
                                COMPANY.salesEmail
                            }
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}