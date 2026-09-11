import {
    Link,
} from "react-router-dom";

import {
    BrandMark,
} from "../../../shared/components/brand/BrandMark";

import {
    PUBLIC_NAVIGATION_ITEMS,
} from "../constants/publicNavigation";

import {
    COMPANY,
} from "../data/company";

export function PublicFooter() {
    const currentYear =
        new Date().getFullYear();

    return (
        <footer className="public-footer">
            <div className="public-container public-footer-grid">
                <div className="public-footer-brand">
                    <BrandMark
                        imageSrc="/images/brand/isocal-logo-white.svg"
                    />

                    <p>
                        {COMPANY.slogan}
                    </p>
                </div>

                <div className="public-footer-column">
                    <h2>
                        Navegación
                    </h2>

                    <nav
                        aria-label="Navegación del pie de página"
                    >
                        {PUBLIC_NAVIGATION_ITEMS.map(
                            (
                                navigationItem,
                            ) => (
                                <Link
                                    key={
                                        navigationItem.to
                                    }
                                    to={
                                        navigationItem.to
                                    }
                                >
                                    {
                                        navigationItem.label
                                    }
                                </Link>
                            ),
                        )}
                    </nav>
                </div>

                <div className="public-footer-column">
                    <h2>
                        Contacto
                    </h2>

                    <a
                        href={
                            COMPANY.primaryPhoneHref
                        }
                    >
                        {
                            COMPANY.primaryPhone
                        }
                    </a>

                    <a
                        href={
                            COMPANY.secondaryPhoneHref
                        }
                    >
                        {
                            COMPANY.secondaryPhone
                        }
                    </a>

                    <a
                        href={
                            COMPANY.salesEmailHref
                        }
                    >
                        {
                            COMPANY.salesEmail
                        }
                    </a>

                    <a
                        href={
                            COMPANY.metrologyEmailHref
                        }
                    >
                        {
                            COMPANY.metrologyEmail
                        }
                    </a>
                </div>
            </div>

            <div className="public-footer-bottom">
                <div className="public-container public-footer-bottom-content">
                    <p>
                        © {currentYear} ISOCAL.
                        Todos los derechos
                        reservados.
                    </p>

                    <a
                        href={
                            COMPANY.website
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        www.isocal.pe
                    </a>
                </div>
            </div>
        </footer>
    );
}