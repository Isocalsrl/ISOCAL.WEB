import { testimonials } from "../../data/corporate";
import { Carousel } from "../Corporate";

export function HomeTestimonialsSection() {
    return (
        <section className="ix-section ix-testimonials">
            <div className="public-container">
                <header className="ix-section-intro ix-section-intro-split">
                    <div>
                        <p className="ix-kicker">Testimonios</p>
                        <h2>Experiencias incluidas en nuestro portafolio.</h2>
                    </div>
                    <p>Testimonios incluidos en el material institucional de ISOCAL.</p>
                </header>
                <Carousel label="Testimonios de clientes">
                    {testimonials.map((testimonial) => (
                        <article className="ix-testimonial" key={`${testimonial.company}-${testimonial.name}`}>
                            <div className="ix-testimonial-top">
                                <span>{testimonial.company}</span>
                                <span>★★★★★</span>
                            </div>
                            <blockquote>“{testimonial.text}”</blockquote>
                            <footer>
                                <strong>{testimonial.name}</strong>
                                <span>{testimonial.role}</span>
                            </footer>
                        </article>
                    ))}
                </Carousel>
            </div>
        </section>
    );
}
