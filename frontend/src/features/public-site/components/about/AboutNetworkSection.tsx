import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";
import { LABORATORY_NETWORK_DESCRIPTION, LABORATORY_PARTNERS } from "../../data/about";

export function AboutNetworkSection() {
    return (
        <section className="ix-about-network ix-about-network-final" id="red">
            <div className="public-container ix-about-network-grid">
                <div>
                    <p className="ix-kicker ix-kicker-light">Red metrológica</p>
                    <h2>Laboratorios aliados según el servicio.</h2>
                    <p>{LABORATORY_NETWORK_DESCRIPTION}</p>
                    <p className="ix-network-scope">El laboratorio y el alcance aplicable se confirman para cada requerimiento.</p>
                    <a
                        className="ix-inline-link ix-inline-link-light"
                        href="/portfolio/portafolio-isocal-2025.pdf"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Ver portafolio institucional <CorporateIcon name="arrow" />
                    </a>
                </div>
                <div className="ix-about-network-panel">
                    <div className="ix-network-panel-head">
                        <span>RED METROLÓGICA</span>
                        <strong>ISOCAL</strong>
                    </div>
                    <div className="ix-about-network-logos">
                        {LABORATORY_PARTNERS.map((partner) => (
                            <div key={partner.id}>
                                <img src={partner.logo} alt={partner.name} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
