import {
    Link,
} from "react-router-dom";

import "./brand.css";

interface BrandMarkProps {
    to?: string;
    onNavigate?: () => void;
    imageSrc?: string;
    imageAlt?: string;
    subtitle?: string;
}

export function BrandMark({
    to = "/",
    onNavigate,
    imageSrc,
    imageAlt = "ISOCAL",
    subtitle =
        "Consultoría y metrología",
}: BrandMarkProps) {
    return (
        <Link
            className="brand-mark"
            to={to}
            aria-label="Ir al inicio de ISOCAL"
            onClick={onNavigate}
        >
            {imageSrc ? (
                <img
                    className="brand-mark-image"
                    src={imageSrc}
                    alt={imageAlt}
                    width="176"
                    height="46"
                />
            ) : (
                <>
                    <span className="brand-word">
                        ISOCAL

                        <span
                            className="brand-chevrons"
                            aria-hidden="true"
                        >
                            »
                        </span>
                    </span>

                    <span className="brand-subtitle">
                        {subtitle}
                    </span>
                </>
            )}
        </Link>
    );
}