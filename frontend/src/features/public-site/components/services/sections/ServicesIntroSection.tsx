import {
    ServiceAreaNavigation,
} from "../ServiceAreaNavigation";

export function ServicesIntroSection() {
    return (
        <section
            className="services-intro public-section"
            aria-labelledby="services-intro-title"
        >
            <div className="public-container">
                <div className="services-intro-heading">
                    <div>
                        <p className="eyebrow">
                            Áreas de servicio
                        </p>

                        <h2 id="services-intro-title">
                            Tres áreas
                            conectadas por
                            una misma
                            exigencia:
                            confianza.
                        </h2>
                    </div>

                    <p>
                        Explora cada área
                        para conocer sus
                        alcances,
                        calibraciones,
                        capacitaciones y
                        esquemas de
                        auditoría.
                    </p>
                </div>

                <ServiceAreaNavigation />
            </div>
        </section>
    );
}
