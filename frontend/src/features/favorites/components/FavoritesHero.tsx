export function FavoritesHero() {
    return (
        <section
            className="favorites-hero"
            aria-labelledby="favorites-hero-title"
        >
            <img
                className="favorites-hero-image"
                src="/images/favorites/hero-favoritos.webp"
                alt="Selección organizada de instrumentos de medición"
                width="1920"
                height="1080"
                fetchPriority="high"
                decoding="async"
            />

            <div
                className="favorites-hero-overlay"
                aria-hidden="true"
            />

            <div className="public-container favorites-hero-content">
                <div>
                    <p className="eyebrow">Selección personal</p>
                    <h1 id="favorites-hero-title">
                        Tus productos favoritos.
                    </h1>
                </div>

                <p className="favorites-hero-description">
                    Guarda equipos mientras exploras el catálogo y vuelve a
                    ellos cuando los necesites. La selección permanece en este
                    navegador.
                </p>
            </div>
        </section>
    );
}
