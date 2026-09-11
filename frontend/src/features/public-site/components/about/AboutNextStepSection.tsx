import {
    ActionLink,
} from "../../../../shared/components/ui/ActionLink";

export function AboutNextStepSection() {
    return (
        <section
            className="about-next-step"
            aria-labelledby="about-next-step-title"
        >
            <div className="public-container about-next-step-grid">
                <div>
                    <p className="eyebrow">
                        Servicios
                    </p>

                    <h2 id="about-next-step-title">
                        Conoce cómo esta
                        capacidad técnica se
                        convierte en
                        soluciones para tu
                        empresa.
                    </h2>
                </div>

                <div className="about-next-step-action">
                    <p>
                        Explora nuestras
                        soluciones de
                        metrología,
                        consultoría y
                        auditoría.
                    </p>

                    <ActionLink
                        to="/servicios"
                    >
                        Ver servicios
                    </ActionLink>
                </div>
            </div>
        </section>
    );
}
