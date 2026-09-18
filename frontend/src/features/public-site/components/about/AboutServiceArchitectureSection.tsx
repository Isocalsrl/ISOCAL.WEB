import { ABOUT_SERVICE_PILLARS } from "../../data/about";

export function AboutServiceArchitectureSection() {
    return (
        <section className="ix-section ix-about-service-architecture" aria-labelledby="about-service-architecture-title">
            <div className="public-container">
                <header className="ix-section-intro ix-section-intro-split">
                    <div>
                        <p className="ix-kicker">Portafolio</p>
                        <h2 id="about-service-architecture-title">Cuatro líneas para necesidades técnicas distintas.</h2>
                    </div>
                    <p>
                        Metrología, consultoría, auditoría y equipamiento se presentan como líneas diferenciadas dentro del portafolio.
                    </p>
                </header>
                <div className="ix-about-pillar-grid">
                    {ABOUT_SERVICE_PILLARS.map((pillar) => (
                        <article className="ix-about-pillar-card" key={pillar.number}>
                            <div className="ix-about-pillar-head">
                                <span>{pillar.number}</span>
                                <small>{pillar.title}</small>
                            </div>
                            <h3>{pillar.title}</h3>
                            <p>{pillar.description}</p>
                            <strong>{pillar.detail}</strong>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
