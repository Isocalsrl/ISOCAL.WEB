import {
    Link,
} from "react-router-dom";

import "./brand.css";

interface BrandMarkProps {
    to?: string;
}

export function BrandMark({
    to = "/",
}: BrandMarkProps) {
    return (
        <Link
            className="brand-mark"
            to={to}
            aria-label="Ir al inicio de ISOCAL"
        >
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
                Consultoría y metrología
            </span>
        </Link>
    );
}
