export function CatalogHeroSection() {
    return (
        <section
            className="products-hero"
            aria-labelledby="products-hero-title"
        >
            <img
                className="products-hero-image"
                src="/images/products/hero-productos.webp"
                alt="Equipos e instrumentos de medición"
                width="1920"
                height="1000"
                fetchPriority="high"
                decoding="async"
            />

            <div
                className="products-hero-overlay"
                aria-hidden="true"
            />

            <div className="public-container products-hero-content">
                <div className="products-hero-copy">
                    <p className="products-hero-kicker">
                        Equipos e
                        insumos
                    </p>

                    <h1 id="products-hero-title">
                        Encuentra el
                        equipo que tu
                        operación
                        necesita.
                    </h1>

                    <p className="products-hero-description">
                        Explora por
                        categoría y
                        consulta cada
                        producto sin
                        perder tu lugar
                        en el catálogo.
                    </p>
                </div>
            </div>
        </section>
    );
}
