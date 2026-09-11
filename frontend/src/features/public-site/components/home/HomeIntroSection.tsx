import {
    Link,
} from "react-router-dom";

import {
    ArrowIcon,
} from "../../../../shared/components/ui/ArrowIcon";

export function HomeIntroSection() {
    return (
        <section
            className="home-intro public-section"
            aria-labelledby="home-intro-title"
        >
            <div className="public-container home-intro-grid">
                <div>
                    <p className="eyebrow">
                        Quiénes somos
                    </p>

                    <h2 id="home-intro-title">
                        Una red metrológica
                        para necesidades
                        técnicas que exigen
                        confianza.
                    </h2>
                </div>

                <div className="home-intro-copy">
                    <p>
                        ISOCAL es una red
                        metrológica compuesta
                        por laboratorios
                        acreditados por
                        INACAL, A2LA y PJLA,
                        enfocada en brindar
                        servicios integrales
                        de metrología para
                        minería, manufactura
                        y laboratorios.
                    </p>

                    <Link
                        className="home-text-link"
                        to="/nosotros"
                    >
                        Conocer ISOCAL

                        <ArrowIcon />
                    </Link>
                </div>
            </div>
        </section>
    );
}
