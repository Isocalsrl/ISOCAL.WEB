import "./feedback.css";

interface FullPageLoaderProps {
    message?: string;
}

export function FullPageLoader({
    message = "Preparando experiencia ISOCAL…",
}: FullPageLoaderProps) {
    return (
        <main
            className="full-page-feedback full-page-loader"
            aria-live="polite"
            aria-busy="true"
        >
            <div className="full-page-loader-brand" aria-hidden="true">
                <span className="full-page-loader-mark">I</span>
                <div>
                    <strong>ISOCAL</strong>
                    <small>Metrología · Consultoría · Equipamiento</small>
                </div>
            </div>

            <div className="full-page-loader-visual" aria-hidden="true">
                <span className="full-page-loader-ring" />
                <span className="full-page-loader-axis full-page-loader-axis-x" />
                <span className="full-page-loader-axis full-page-loader-axis-y" />
                <span className="full-page-loader-dot" />
            </div>

            <p>{message}</p>
            <div className="full-page-loader-progress" aria-hidden="true"><span /></div>
        </main>
    );
}
