import { COMPANY } from "../data/company";
import { PageSeo } from "../../../shared/seo/PageSeo";
import { CorporateHero } from "../components/Corporate";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";
import { ComplaintForm } from "../../requests/components/ComplaintForm";

export function LegalPage({type}: { type: "privacy" | "terms" | "complaints" }) {
    const title =
        type === "privacy"
            ? "Política de privacidad"
            : type === "terms"
              ? "Términos y condiciones"
              : "Libro de reclamaciones";

    return (
        <main className={`ix-legal-page ix-legal-page-${type}`}>
            <PageSeo
                title={`${title} | ISOCAL`}
                description={
                    type === "privacy"
                        ? "Información sobre el tratamiento de datos personales en el sitio de ISOCAL."
                        : type === "terms"
                          ? "Condiciones de uso del sitio y de las solicitudes comerciales de ISOCAL."
                          : "Libro de reclamaciones en línea de ISOCAL."
                }
                canonicalPath={
                    type === "privacy"
                        ? "/privacidad"
                        : type === "terms"
                          ? "/terminos"
                          : "/reclamaciones"
                }
            />
            <CorporateHero
                eyebrow="Información y atención"
                title={title}
                description={
                    type === "privacy"
                        ? "Consulta qué datos recopilamos y cómo los usamos."
                        : type === "terms"
                          ? "Condiciones de uso del sitio y de las solicitudes comerciales."
                          : "Registra un reclamo o queja y recibe una constancia."
                }
                image={
                    type === "complaints"
                        ? "/images/editorial/equipo-contacto.webp"
                        : type === "terms"
                          ? "/images/editorial/calibracion.webp"
                          : "/images/editorial/instrumentacion.webp"
                }
            />
            <section className="co-section ix-legal-section">
                <div className="public-container co-legal">
                    <div className="co-legal-identity">
                        <span className="co-legal-identity-icon" aria-hidden="true">
                            <CorporateIcon name={type === "complaints" ? "clipboard" : "shield"} />
                        </span>
                        <div>
                            <strong>{COMPANY.legalName}</strong>
                            <p>
                                RUC: {COMPANY.ruc} · {COMPANY.location}
                                <br />
                                Contacto: <a href={COMPANY.salesEmailHref}>{COMPANY.salesEmail}</a>
                            </p>
                        </div>
                    </div>

                    {type === "privacy" ? (
                        <div className="ix-legal-document">
                            <div className="ix-legal-document-intro">
                                <p className="ix-kicker">Tratamiento de información</p>
                                <h2>Cómo usamos tus datos</h2>
                                <p>
                                    ISOCAL utiliza los datos que proporcionas en este sitio para atender
                                    consultas comerciales, preparar cotizaciones y responder
                                    reclamaciones. Puedes contactarnos en{" "}
                                    <a href="mailto:ventas@isocal.pe">ventas@isocal.pe</a>.
                                </p>
                            </div>

                            <div className="ix-legal-card-grid">
                                <article className="ix-legal-card">
                                    <span className="ix-legal-card-icon"><CorporateIcon name="user" /></span>
                                    <span className="ix-legal-card-number">01</span>
                                    <h3>Información que proporcionas</h3>
                                    <p>
                                        Los formularios solicitan tu nombre, correo y teléfono. Según el
                                        trámite, puedes facilitar información de tu empresa, RUC, ubicación
                                        y detalles de tu requerimiento. El libro de reclamaciones solicita
                                        además datos para identificar al consumidor y el servicio contratado.
                                    </p>
                                </article>
                                <article className="ix-legal-card">
                                    <span className="ix-legal-card-icon"><CorporateIcon name="mail" /></span>
                                    <span className="ix-legal-card-number">02</span>
                                    <h3>Finalidad y destinatarios</h3>
                                    <p>
                                        El formulario envía la información al correo del equipo de ISOCAL.
                                        Para transportar el mensaje utilizamos un proveedor de correo
                                        electrónico (Resend), que procesa los datos necesarios para prestar
                                        ese servicio. Tus datos no se utilizan para suscripciones publicitarias
                                        desde estos formularios.
                                    </p>
                                </article>
                                <article className="ix-legal-card">
                                    <span className="ix-legal-card-icon"><CorporateIcon name="layers" /></span>
                                    <span className="ix-legal-card-number">03</span>
                                    <h3>Favoritos, selección y sesión</h3>
                                    <p>
                                        Los favoritos y la lista de cotización se guardan en el almacenamiento local de
                                        tu navegador. Puedes quitarlos desde la página correspondiente o borrar
                                        los datos del sitio. El acceso administrativo utiliza una cookie de
                                        sesión necesaria para la autenticación.
                                    </p>
                                </article>
                                <article className="ix-legal-card ix-legal-card-accent">
                                    <span className="ix-legal-card-icon"><CorporateIcon name="shield" /></span>
                                    <span className="ix-legal-card-number">04</span>
                                    <h3>Tus derechos</h3>
                                    <p>
                                        Puedes solicitar acceso, rectificación, cancelación u oposición al
                                        tratamiento de tus datos escribiendo a ventas@isocal.pe, indicando tu
                                        solicitud y la información necesaria para acreditar tu identidad.
                                        Conservamos las comunicaciones para atender el requerimiento y las
                                        obligaciones aplicables.
                                    </p>
                                    <a
                                        href="https://www.gob.pe/9270-que-son-los-derechos-arco"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Más información: guía de derechos ARCO de la Autoridad Nacional de Protección
                                        de Datos Personales <CorporateIcon name="external" />
                                    </a>
                                </article>
                            </div>
                        </div>
                    ) : type === "terms" ? (
                        <div className="ix-legal-document">
                            <div className="ix-legal-document-intro">
                                <p className="ix-kicker">Condiciones del sitio</p>
                                <h2>Información comercial</h2>
                                <p>
                                    Este sitio presenta los servicios, equipos e insumos de ISOCAL. La selección
                                    de productos constituye una solicitud de información y cotización. El envío
                                    del formulario no confirma una compra ni requiere efectuar un pago.
                                </p>
                            </div>
                            <div className="ix-legal-card-grid">
                                <article className="ix-legal-card">
                                    <span className="ix-legal-card-number">01</span>
                                    <h3>Disponibilidad y condiciones</h3>
                                    <p>
                                        Modelos, especificaciones, disponibilidad, precios, plazos de entrega y
                                        condiciones del servicio se confirman en la cotización que el equipo
                                        comercial envía por correo. Las imágenes del portafolio son referenciales de
                                        las familias ofrecidas.
                                    </p>
                                </article>
                                <article className="ix-legal-card">
                                    <span className="ix-legal-card-number">02</span>
                                    <h3>Servicios de calibración</h3>
                                    <p>
                                        El alcance, laboratorio responsable, método y condiciones aplicables se
                                        acuerdan para cada requerimiento. La red de laboratorios descrita en el
                                        portafolio no implica que todos los servicios compartan el mismo alcance de
                                        acreditación.
                                    </p>
                                </article>
                                <article className="ix-legal-card">
                                    <span className="ix-legal-card-number">03</span>
                                    <h3>Uso de contenidos</h3>
                                    <p>
                                        Los textos, imágenes y materiales identificados con ISOCAL se presentan
                                        con fines informativos. Las marcas comerciales de terceros pertenecen a
                                        sus respectivos titulares.
                                    </p>
                                </article>
                                <article className="ix-legal-card ix-legal-card-accent">
                                    <span className="ix-legal-card-number">04</span>
                                    <h3>Atención al cliente</h3>
                                    <p>
                                        Para consultas escribe a ventas@isocal.pe. Para un reclamo o queja utiliza
                                        el Libro de Reclamaciones disponible en el pie de página.
                                    </p>
                                </article>
                            </div>
                        </div>
                    ) : (
                        <div className="ix-complaints-workspace">
                            <div className="ix-complaints-intro">
                                <div>
                                    <p className="ix-kicker">Atención al consumidor</p>
                                    <h2>Registra tu reclamo o queja</h2>
                                    <p>
                                        Registra tu reclamo o queja en línea. Al enviarlo recibirás una constancia y el equipo responsable contará con los datos necesarios para atenderlo.
                                    </p>
                                </div>
                                <div className="ix-complaints-summary">
                                    <div><CorporateIcon name="clipboard" /><span><strong>Reclamo</strong>Disconformidad con un producto o servicio.</span></div>
                                    <div><CorporateIcon name="message" /><span><strong>Queja</strong>Disconformidad con la atención u otro aspecto.</span></div>
                                    <div><CorporateIcon name="clock" /><span><strong>15 días hábiles</strong>Plazo máximo indicado para la respuesta.</span></div>
                                </div>
                                <a
                                    className="ix-complaints-rights-link"
                                    href="https://consumidor.gob.pe/libro-de-reclamaciones/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Conoce tus derechos en Indecopi <CorporateIcon name="external" />
                                </a>
                            </div>
                            <ComplaintForm />
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
