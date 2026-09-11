import {
    HOME_INDUSTRIES,
} from "../../data/home";

export function HomeIndustriesSection() {
    return (
        <section
            className="home-industries public-section"
            aria-labelledby="home-industries-title"
        >
            <div className="public-container">
                <div className="home-section-heading home-section-heading-compact">
                    <div>
                        <p className="eyebrow">
                            Sectores atendidos
                        </p>

                        <h2 id="home-industries-title">
                            Metrología aplicada
                            al entorno real de
                            cada operación.
                        </h2>
                    </div>
                </div>

                <div className="home-industries-grid">
                    {HOME_INDUSTRIES.map(
                        (
                            industry,
                        ) => (
                            <article
                                key={
                                    industry.number
                                }
                                className="home-industry-item"
                            >
                                <span>
                                    {
                                        industry.number
                                    }
                                </span>

                                <h3>
                                    {
                                        industry.title
                                    }
                                </h3>

                                <p>
                                    {
                                        industry.description
                                    }
                                </p>
                            </article>
                        ),
                    )}
                </div>
            </div>
        </section>
    );
}
