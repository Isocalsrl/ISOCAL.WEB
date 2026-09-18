import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";
import { LABORATORY_PARTNERS } from "../../data/about";
import { Reveal } from "./Reveal";

export function NetworkBand() {
    return (
        <section className="co-network" id="red">
            <div className="public-container">
                <div className="co-network-grid">
                    <Reveal>
                        <span className="co-eyebrow">Red metrológica · Alianza comercial</span>
                        <h2>Respaldo técnico para cada medición.</h2>
                    </Reveal>
                    <Reveal>
                        <p>Conectamos tu operación con una red de laboratorios acreditados por INACAL, A2LA y PJLA, según el alcance de cada servicio.</p>
                        <a className="co-text-link" href="/portfolio/portafolio-isocal-2025.pdf" target="_blank" rel="noreferrer">
                            Conoce nuestra red en el portafolio <CorporateIcon name="arrow" />
                        </a>
                    </Reveal>
                </div>
                <div className="co-partners">
                    {LABORATORY_PARTNERS.map((partner) => (
                        <div key={partner.id}><img src={partner.logo} alt={partner.name} loading="lazy" /></div>
                    ))}
                </div>
                <p className="co-network-note">Laboratorios aliados del portafolio institucional. Consulta con nuestro equipo el alcance aplicable a tus instrumentos.</p>
            </div>
        </section>
    );
}
