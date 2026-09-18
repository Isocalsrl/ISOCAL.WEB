import { COMPANY } from "../../data/company";

export function AboutPurposeSection() {
    return (
        <section className="ix-about-purpose ix-about-purpose-final">
            <div className="public-container">
                <header className="ix-about-purpose-heading">
                    <p className="ix-kicker">Nuestro propósito</p>
                    <p>01—02 / Dirección institucional</p>
                </header>
                <div className="ix-purpose-grid">
                    <div className="ix-purpose-mission">
                        <span>01</span>
                        <h2>Misión</h2>
                        <p>{COMPANY.mission}</p>
                    </div>
                    <div className="ix-purpose-vision">
                        <span>02</span>
                        <h2>Visión</h2>
                        <p>{COMPANY.vision}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
