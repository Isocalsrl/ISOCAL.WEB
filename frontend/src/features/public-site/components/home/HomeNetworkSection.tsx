import { LABORATORY_PARTNERS } from "../../data/about";

export function HomeNetworkSection() {
    return (
        <section className="ix-network-ribbon" aria-labelledby="home-network-title">
            <div className="public-container ix-network-ribbon-grid">
                <div>
                    <p className="ix-kicker ix-kicker-light">Red metrológica</p>
                    <h2 id="home-network-title">Laboratorios aliados para ampliar cobertura.</h2>
                    <p>
                        Laboratorios aliados incluidos en el portafolio institucional. El alcance aplicable se confirma según el servicio y el instrumento.
                    </p>
                </div>
                <div className="ix-network-logos" aria-label="Laboratorios aliados">
                    <div className="ix-network-logos-track">
                        <div className="ix-network-logo-group">
                            {LABORATORY_PARTNERS.map((partner) => (
                                <div key={partner.id}>
                                    <img src={partner.logo} alt={partner.name} loading="lazy" />
                                </div>
                            ))}
                        </div>
                        <div className="ix-network-logo-group" aria-hidden="true">
                            {LABORATORY_PARTNERS.map((partner) => (
                                <div key={`duplicate-${partner.id}`}>
                                    <img src={partner.logo} alt="" loading="lazy" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
