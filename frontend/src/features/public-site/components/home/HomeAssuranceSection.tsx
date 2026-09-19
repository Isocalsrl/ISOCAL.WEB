import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";
import { HOME_ASSURANCE_ITEMS } from "../../data/homePage";
import { Reveal } from "../Corporate";

export function HomeAssuranceSection() {
    return (
        <section className="ix-assurance-strip" aria-labelledby="assurance-title">
            <div className="public-container">
                <Reveal className="ix-assurance-heading">
                    <span className="ix-section-pill">Marco técnico</span>
                    <h2 id="assurance-title">Acreditaciones y normas del portafolio.</h2>
                    <p>Referencias técnicas declaradas en la información institucional de ISOCAL.</p>
                </Reveal>
                <div className="ix-assurance-grid">
                    {HOME_ASSURANCE_ITEMS.map((item) => (
                        <article className="ix-assurance-card" key={item.number}>
                            <div className="ix-assurance-number">{item.number}</div>
                            <div className="ix-assurance-icon"><CorporateIcon name="check" /></div>
                            <small>{item.eyebrow}</small>
                            <h3>{item.title}</h3>
                            <p>{item.detail}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
