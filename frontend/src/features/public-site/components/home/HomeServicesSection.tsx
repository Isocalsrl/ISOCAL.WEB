import { Link } from "react-router-dom";
import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";
import { HOME_SERVICE_AREAS } from "../../data/homePage";

export function HomeServicesSection() {
    return (
        <section className="ix-section ix-home-services" id="soluciones">
            <div className="public-container">
                <header className="ix-section-intro ix-section-intro-split">
                    <div>
                        <p className="ix-kicker">Servicios</p>
                        <h2>Metrología, consultoría y auditoría.</h2>
                    </div>
                    <p>
                        Revisa cada área para conocer los servicios publicados y ubicar la opción que corresponde a tu necesidad.
                    </p>
                </header>

                <div className="ix-service-story">
                    {HOME_SERVICE_AREAS.map((area, index) => (
                        <article
                            className={`ix-service-story-row ix-service-story-row-${index + 1}`}
                            key={area.id}
                        >
                            <Link
                                className="ix-service-story-media"
                                to={`/servicios#${area.id}`}
                                aria-label={`Conocer ${area.label}`}
                            >
                                <img src={area.image} alt="" loading="lazy" />
                            </Link>
                            <div className="ix-service-story-copy">
                                <div className="ix-service-story-meta">
                                    <span>{area.number}</span>
                                    <small>{area.label}</small>
                                </div>
                                <h3>{area.title}</h3>
                                <p>{area.description}</p>
                                <small className="ix-service-detail">{area.detail}</small>
                                <Link className="ix-inline-link" to={`/servicios#${area.id}`}>
                                    Ver servicio <CorporateIcon name="arrow" />
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
