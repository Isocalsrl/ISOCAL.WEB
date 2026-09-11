import {
    ActionLink,
} from "../../../../shared/components/ui/ActionLink";

export function HomeProductsSection() {
    return (
        <section
            className="home-products"
            aria-labelledby="home-products-title"
        >
            <div className="public-container home-products-grid">
                <div className="home-products-image">
                    <img
                        src="/images/home/equipos-insumos.webp"
                        alt="Equipos e instrumentos de medición comercializados por ISOCAL"
                        width="1200"
                        height="900"
                        loading="lazy"
                        decoding="async"
                    />
                </div>

                <div className="home-products-copy">
                    <p className="eyebrow">
                        Equipos e insumos
                    </p>

                    <h2 id="home-products-title">
                        Equipamiento para
                        medir, monitorear y
                        trabajar con mayor
                        control.
                    </h2>

                    <p>
                        ISOCAL complementa sus
                        servicios con venta
                        de equipos e insumos
                        para medición,
                        laboratorio, monitoreo
                        y otras necesidades
                        técnicas de la
                        industria.
                    </p>

                    <ActionLink
                        to="/productos"
                    >
                        Explorar catálogo
                    </ActionLink>
                </div>
            </div>
        </section>
    );
}
