import {
    ABOUT_ACCREDITATION_BODIES,
    ABOUT_OVERVIEW,
} from "../../data/about";

export function AboutOverviewSection() {
    return (
        <section
            className="about-overview public-section"
            aria-labelledby="about-overview-title"
        >
            <div className="public-container about-overview-grid">
                <div className="about-overview-heading">
                    <p className="eyebrow">
                        ¿Quiénes somos?
                    </p>

                    <h2 id="about-overview-title">
                        Metrología integral
                        para operaciones que
                        necesitan confianza
                        en sus mediciones.
                    </h2>
                </div>

                <div className="about-overview-content">
                    <p>
                        {ABOUT_OVERVIEW}
                    </p>

                    <div
                        className="about-accreditations"
                        aria-label="Entidades de acreditación mencionadas por ISOCAL"
                    >
                        <span>
                            Laboratorios
                            acreditados por
                        </span>

                        <div>
                            {ABOUT_ACCREDITATION_BODIES.map(
                                (
                                    accreditation,
                                ) => (
                                    <strong
                                        key={
                                            accreditation
                                        }
                                    >
                                        {
                                            accreditation
                                        }
                                    </strong>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
