import {
    Link,
} from "react-router-dom";

import {
    ArrowIcon,
} from "../../../shared/components/ui/ArrowIcon";

import type {
    HomeServicePreview,
} from "../data/home";

interface ServicePreviewCardProps {
    service:
        HomeServicePreview;
}

export function ServicePreviewCard({
    service,
}: ServicePreviewCardProps) {
    return (
        <article className="home-service-card">
            <Link
                className="home-service-card-link"
                to="/servicios"
                aria-label={`Conocer el servicio de ${service.title}`}
            >
                <div className="home-service-card-image">
                    <img
                        src={
                            service.image
                        }
                        alt={
                            service.imageAlt
                        }
                        width="960"
                        height="720"
                        loading="lazy"
                        decoding="async"
                    />
                </div>

                <div className="home-service-card-content">
                    <span className="home-service-card-number">
                        {
                            service.number
                        }
                    </span>

                    <h3>
                        {service.title}
                    </h3>

                    <p>
                        {
                            service.description
                        }
                    </p>

                    <span className="home-text-link">
                        Ver servicio

                        <ArrowIcon />
                    </span>
                </div>
            </Link>
        </article>
    );
}