import {
    Link,
} from "react-router-dom";

import {
    ArrowIcon,
} from "../../../../shared/components/ui/ArrowIcon";

export function HomeNetworkSection() {
    return (
        <section
            className="home-network"
            aria-labelledby="home-network-title"
        >
            <div className="public-container home-network-grid">
                <div className="home-network-image">
                    <img
                        src="/images/home/red-metrologica.webp"
                        alt="Laboratorio e instrumentos de medición asociados a la red metrológica de ISOCAL"
                        width="1200"
                        height="1000"
                        loading="lazy"
                        decoding="async"
                    />
                </div>

                <div className="home-network-copy">
                    <p className="eyebrow eyebrow-light">
                        Red metrológica
                    </p>

                    <h2 id="home-network-title">
                        Capacidad técnica
                        conectada para
                        responder mejor.
                    </h2>

                    <p>
                        ISOCAL ha integrado a
                        su red metrológica
                        laboratorios
                        acreditados y
                        especializados con el
                        objetivo de ampliar
                        el valor entregado a
                        sus clientes.
                    </p>

                    <div className="home-accreditation-line">
                        <span>
                            Laboratorios
                            acreditados por
                        </span>

                        <strong>
                            INACAL · A2LA ·
                            PJLA
                        </strong>
                    </div>

                    <Link
                        className="home-text-link home-text-link-light"
                        to="/nosotros"
                    >
                        Ver nuestra
                        organización

                        <ArrowIcon />
                    </Link>
                </div>
            </div>
        </section>
    );
}
