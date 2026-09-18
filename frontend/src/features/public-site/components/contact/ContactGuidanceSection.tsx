import { CONTACT_QUOTE_HINTS } from "../../data/contact";

export function ContactGuidanceSection() {
    return (
        <section className="ix-contact-guidance">
            <div className="public-container ix-contact-guidance-grid">
                <div>
                    <h2>Datos útiles para revisar tu solicitud.</h2>
                </div>
                <div className="ix-contact-hints">
                    {CONTACT_QUOTE_HINTS.map((hint, index) => (
                        <div key={hint}>
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <strong>{hint}</strong>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
