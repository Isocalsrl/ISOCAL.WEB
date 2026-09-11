import {
    SERVICE_NAVIGATION,
} from "../../data/services";

export function ServiceAreaNavigation() {
    return (
        <nav
            className="services-area-navigation"
            aria-label="Áreas de servicio"
        >
            {SERVICE_NAVIGATION.map(
                (
                    service,
                ) => (
                    <a
                        key={
                            service.id
                        }
                        className="services-area-navigation-item"
                        href={`#${service.id}`}
                    >
                        <span className="services-area-navigation-number">
                            {
                                service.number
                            }
                        </span>

                        <div>
                            <strong>
                                {
                                    service.title
                                }
                            </strong>

                            <p>
                                {
                                    service.description
                                }
                            </p>
                        </div>

                        <span
                            className="services-area-navigation-arrow"
                            aria-hidden="true"
                        >
                            ↓
                        </span>
                    </a>
                ),
            )}
        </nav>
    );
}