import {
    LABORATORY_NETWORK_DESCRIPTION,
    LABORATORY_PARTNERS,
} from "../../data/about";

export function AboutNetworkSection() {
    return (
        <section
            className="about-network"
            aria-labelledby="about-network-title"
        >
            <div className="public-container about-network-grid">
                <div className="about-network-image">
                    <img
                        src="/images/about/laboratorio-red.webp"
                        alt="Laboratorio de la red metrológica de ISOCAL"
                        width="1400"
                        height="1000"
                        loading="lazy"
                        decoding="async"
                    />
                </div>

                <div className="about-network-content">
                    <p className="eyebrow eyebrow-light">
                        Alianza comercial
                    </p>

                    <h2 id="about-network-title">
                        Una red creada para
                        ampliar nuestra
                        capacidad de
                        respuesta.
                    </h2>

                    <p className="about-network-description">
                        {
                            LABORATORY_NETWORK_DESCRIPTION
                        }
                    </p>

                    <div className="about-network-partners">
                        <p>
                            Red de laboratorios
                        </p>

                        <div className="about-partner-grid">
                            {LABORATORY_PARTNERS.map(
                                (
                                    partner,
                                ) => (
                                    <div
                                        key={
                                            partner.id
                                        }
                                        className="about-partner"
                                    >
                                        <img
                                            src={
                                                partner.logo
                                            }
                                            alt={
                                                partner.logoAlt
                                            }
                                            width="220"
                                            height="90"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
