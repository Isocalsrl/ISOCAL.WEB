import {
    ServicePreviewCard,
} from "../ServicePreviewCard";

import {
    HOME_SERVICE_PREVIEWS,
} from "../../data/home";

export function HomeServicesSection() {
    return (
        <section
            className="home-services public-section"
            aria-labelledby="home-services-title"
        >
            <div className="public-container">
                <div className="home-section-heading">
                    <div>
                        <p className="eyebrow">
                            Nuestros servicios
                        </p>

                        <h2 id="home-services-title">
                            Tres áreas, una
                            misma exigencia
                            técnica.
                        </h2>
                    </div>

                    <p>
                        Integramos servicios
                        de metrología,
                        consultoría y
                        auditoría para
                        acompañar a las
                        organizaciones desde
                        la medición hasta la
                        mejora de sus sistemas
                        de gestión.
                    </p>
                </div>

                <div className="home-services-grid">
                    {HOME_SERVICE_PREVIEWS.map(
                        (
                            service,
                        ) => (
                            <ServicePreviewCard
                                key={
                                    service.id
                                }
                                service={
                                    service
                                }
                            />
                        ),
                    )}
                </div>
            </div>
        </section>
    );
}
