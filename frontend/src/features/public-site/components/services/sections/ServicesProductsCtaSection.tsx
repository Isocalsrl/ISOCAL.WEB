import {
    ActionLink,
} from "../../../../../shared/components/ui/ActionLink";

export function ServicesProductsCtaSection() {
    return (
        <section
            className="services-products-cta"
            aria-labelledby="services-products-title"
        >
            <div className="public-container services-products-cta-grid">
                <div>
                    <p className="eyebrow">
                        Equipamiento
                    </p>

                    <h2 id="services-products-title">
                        ¿Además necesitas
                        equipos o
                        insumos?
                    </h2>
                </div>

                <div className="services-products-cta-action">
                    <p>
                        ISOCAL también
                        comercializa
                        equipamiento para
                        medición,
                        laboratorio,
                        monitoreo y otras
                        necesidades
                        técnicas.
                    </p>

                    <ActionLink
                        variant="dark"
                        to="/productos"
                    >
                        Ver catálogo
                    </ActionLink>
                </div>
            </div>
        </section>
    );
}
