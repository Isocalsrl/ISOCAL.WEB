import { Link } from "react-router-dom";
import { PublicStatePanel, QuotationFormSkeleton } from "../../../shared/components/feedback";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";
import { PageSeo } from "../../../shared/seo/PageSeo";
import { QuotationRequestForm } from "../components/QuotationRequestForm";
import { useQuotation } from "../hooks/useQuotation";
import { useQuotationProducts } from "../hooks/useQuotationProducts";

const QUOTATION_STEPS = [
    {
        number: "01",
        icon: "package" as const,
        title: "Revisa tu selección",
        description: "Confirma los equipos que quieres incluir y elimina los que ya no necesites.",
    },
    {
        number: "02",
        icon: "user" as const,
        title: "Completa tus datos",
        description: "Déjanos un contacto válido para que el equipo comercial pueda responderte.",
    },
    {
        number: "03",
        icon: "ruler" as const,
        title: "Añade contexto técnico",
        description: "Modelo, rango, cantidad o una condición especial ayudan a precisar la respuesta.",
    },
];

export function QuotationPage() {
    const selection = useQuotationProducts();
    const {removeFromQuotation} = useQuotation();

    return (
        <main className="ix-quotation-page">
            <PageSeo
                title="Solicitar cotización | ISOCAL"
                description="Envía tu requerimiento y recibe una constancia en PDF por correo. El equipo de ISOCAL preparará tu propuesta."
                canonicalPath="/cotizacion"
            />

            <section className="ix-utility-hero ix-utility-hero-dark ix-quotation-hero">
                <div className="public-container ix-quotation-hero-grid">
                    <div className="ix-quotation-hero-copy">
                        <p className="ix-breadcrumb">
                            <Link to="/">Inicio</Link> <span>/</span> Cotización
                        </p>
                        <p className="ix-kicker ix-kicker-light">Solicitud B2B</p>
                        <h1>Solicitar cotización.</h1>
                        <p>
                            Revisa tu selección, completa tus datos y recibe por correo una copia en PDF de tu requerimiento. El equipo comercial recibirá la solicitud.
                        </p>
                        <Link className="ix-inline-link ix-inline-link-light ix-quotation-hero-link" to="/productos">
                            Seguir explorando <CorporateIcon name="arrow" />
                        </Link>
                    </div>

                    <div className="ix-quotation-hero-media" aria-hidden="true">
                        <img src="/images/quotation/hero-cotizacion.webp" alt="" />
                        <div className="ix-quotation-hero-note">
                            <span>Solicitud técnica</span>
                            <strong>Tu solicitud llega al equipo comercial con los equipos seleccionados.</strong>
                        </div>
                    </div>
                </div>
            </section>

            <section className="ix-section ix-quotation-section">
                <div className="public-container ix-quotation-grid">
                    <aside className="ix-quotation-aside">
                        <div className="ix-quotation-aside-heading">
                            <p className="ix-kicker">Antes de enviar</p>
                            <h2>Revisa los datos de tu solicitud.</h2>
                            <p>Añade modelo, rango, cantidad u otra condición relevante cuando la conozcas.</p>
                        </div>

                        <div className="ix-quotation-steps" aria-label="Pasos para solicitar una cotización">
                            {QUOTATION_STEPS.map((step) => (
                                <div className="ix-quotation-step" key={step.number}>
                                    <div className="ix-quotation-step-icon" aria-hidden="true">
                                        <CorporateIcon name={step.icon} />
                                    </div>
                                    <div>
                                        <span>{step.number}</span>
                                        <strong>{step.title}</strong>
                                        <p>{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="ix-quotation-aside-note">
                            <CorporateIcon name="info" />
                            <p>No necesitas crear una cuenta ni completar datos técnicos que no conozcas.</p>
                        </div>
                    </aside>

                    <div className="ix-quotation-form-wrap">
                        {selection.quotationCount === 0 ? (
                            <QuotationRequestForm
                                products={[]}
                                onSuccess={selection.clearQuotation}
                                onRemove={removeFromQuotation}
                            />
                        ) : selection.isLoading ? (
                            <QuotationFormSkeleton />
                        ) : selection.errorMessage ? (
                            <div className="ix-quotation-state-wrap">
                                <PublicStatePanel
                                    variant={selection.errorKind === "network" ? "network" : "error"}
                                    eyebrow={selection.errorKind === "network" ? "Sin conexión" : "No pudimos preparar tu solicitud"}
                                    title={selection.errorKind === "network" ? "No pudimos cargar tu selección" : "Tu solicitud no está disponible todavía"}
                                    description={selection.errorMessage}
                                    primaryAction={{ label: "Volver a intentar", onClick: selection.reload }}
                                    secondaryAction={{ label: "Volver al catálogo", to: "/productos" }}
                                />
                            </div>
                        ) : (
                            <QuotationRequestForm
                                products={selection.quotationProducts}
                                onSuccess={selection.clearQuotation}
                                onRemove={removeFromQuotation}
                            />
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
