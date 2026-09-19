import { Link } from "react-router-dom";
import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";
import { Count } from "../Corporate";

export function HomeAboutSection() {
    return (
        <section className="ix-section ix-home-about">
            <div className="public-container ix-home-about-grid">
                <div className="ix-home-about-media">
                    <img src="/images/company/ORIGG.png" alt="Equipo de ISOCAL" loading="lazy" />
                    <div className="ix-image-index">ISOCAL / EQUIPO</div>
                </div>
                <div className="ix-home-about-copy">
                    <p className="ix-kicker">Quiénes somos</p>
                    <h2>Una red metrológica para industria y laboratorios.</h2>
                    <p>
                        ISOCAL integra laboratorios aliados y servicios de metrología para minería, manufactura y laboratorios, junto con equipamiento y capacitación.
                    </p>
                    <Link className="ix-inline-link" to="/nosotros">
                        Conocer ISOCAL <CorporateIcon name="arrow" />
                    </Link>
                    <div className="ix-home-stats">
                        <Count value={19} label="áreas de calibración" />
                        <Count value={4} label="laboratorios aliados" />
                        <Count value={3} label="líneas principales" />
                    </div>
                </div>
            </div>
        </section>
    );
}
