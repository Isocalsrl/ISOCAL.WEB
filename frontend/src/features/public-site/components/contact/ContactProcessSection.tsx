import { CONTACT_REQUEST_STEPS } from "../../data/contact";

export function ContactProcessSection() {
    return (
        <section className="ix-contact-process">
            <div className="public-container">
                <header className="ix-section-intro ix-section-intro-split">
                    <div>
                        <h2>Qué ocurre con tu solicitud.</h2>
                    </div>
                    <p>
                        Revisamos la información y la derivamos al área correspondiente.
                    </p>
                </header>
                <div className="ix-contact-process-grid">
                    {CONTACT_REQUEST_STEPS.map((step) => (
                        <article key={step.number} className="ix-contact-process-card">
                            <span>{step.number}</span>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
