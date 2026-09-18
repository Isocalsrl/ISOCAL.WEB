import { ABOUT_SECTORS } from "../../data/about";

export function AboutSectorsSection() {
    return (
        <section className="ix-section ix-about-sectors" aria-labelledby="about-sectors-title">
            <div className="public-container">
                <header className="ix-section-intro ix-section-intro-split">
                    <div>
                        <p className="ix-kicker">Sectores atendidos</p>
                        <h2 id="about-sectors-title">Sectores atendidos por ISOCAL.</h2>
                    </div>
                    <p>
                        El portafolio incluye servicios y equipamiento para minería, manufactura y laboratorios.
                    </p>
                </header>
                <div className="ix-about-sector-grid">
                    {ABOUT_SECTORS.map((sector) => (
                        <article className="ix-about-sector-card" key={sector.number}>
                            <span>{sector.number}</span>
                            <h3>{sector.title}</h3>
                            <p>{sector.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
