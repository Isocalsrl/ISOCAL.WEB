import { CONTACT_FOCUS_AREAS } from "../../data/contact";

export function ContactScopeSection() {
    return (
        <section className="ix-contact-scope">
            <div className="public-container">
                <header className="ix-section-intro ix-section-intro-split">
                    <div>
                        <p className="ix-kicker">Consultas frecuentes</p>
                        <h2>Qué puedes consultar al equipo.</h2>
                    </div>
                    <p>
                        Estas son las principales áreas que puedes indicar en tu solicitud.
                    </p>
                </header>
                <div className="ix-contact-scope-grid">
                    {CONTACT_FOCUS_AREAS.map((area, index) => (
                        <article key={area} className="ix-contact-scope-card">
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <strong>{area}</strong>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
