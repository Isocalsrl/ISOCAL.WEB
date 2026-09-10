import "./feedback.css";

interface FullPageLoaderProps {
    message?: string;
}

export function FullPageLoader({
    message = "Cargando...",
}: FullPageLoaderProps) {
    return (
        <main
            className="full-page-feedback"
            aria-live="polite"
            aria-busy="true"
        >
            <span
                className="full-page-spinner"
                aria-hidden="true"
            />

            <p>{message}</p>
        </main>
    );
}