export function QuotationHero() {
    return (
        <section
            className="quotation-hero"
            aria-labelledby="quotation-hero-title"
        >
            <img
                className="quotation-hero-image"
                src="/images/quotation/hero-cotizacion.webp"
                alt="Instrumentos de medición y documentación técnica en revisión"
                width="1920"
                height="1080"
                fetchPriority="high"
                decoding="async"
            />

            <div
                className="quotation-hero-overlay"
                aria-hidden="true"
            />

            <div className="public-container quotation-hero-content">
                <div>
                    <p className="eyebrow">Selección técnica</p>
                    <h1 id="quotation-hero-title">
                        Prepara tu cotización.
                    </h1>
                </div>

                <p className="quotation-hero-description">
                    Reúne los equipos e insumos que necesitas, indica cantidades
                    y envía tus datos para que el equipo de ISOCAL revise la
                    solicitud.
                </p>
            </div>
        </section>
    );
}
