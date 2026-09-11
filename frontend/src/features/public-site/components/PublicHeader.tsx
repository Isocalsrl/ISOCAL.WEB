import {
    useState,
} from "react";

import {
    NavLink,
} from "react-router-dom";

import {
    BrandMark,
} from "../../../shared/components/brand/BrandMark";

import {
    PUBLIC_NAVIGATION_ITEMS,
} from "../constants/publicNavigation";

import {
    contactUrl,
} from "../data/company";

function navigationLinkClass({
    isActive,
}: {
    isActive: boolean;
}): string {
    return isActive
        ? "public-navigation-link public-navigation-link-active"
        : "public-navigation-link";
}

export function PublicHeader() {
    const [
        isNavigationOpen,
        setIsNavigationOpen,
    ] = useState(false);

    function closeNavigation(): void {
        setIsNavigationOpen(
            false,
        );
    }

    return (
        <header className="public-header">
            <div className="public-container public-header-content">
                <BrandMark
                    imageSrc="/images/brand/isocal-logo.svg"
                    onNavigate={
                        closeNavigation
                    }
                />

                <button
                    className="public-menu-button"
                    type="button"
                    aria-label={
                        isNavigationOpen
                            ? "Cerrar menú de navegación"
                            : "Abrir menú de navegación"
                    }
                    aria-controls="public-navigation"
                    aria-expanded={
                        isNavigationOpen
                    }
                    onClick={() => {
                        setIsNavigationOpen(
                            (
                                currentValue,
                            ) =>
                                !currentValue,
                        );
                    }}
                >
                    <span
                        aria-hidden="true"
                    />

                    <span
                        aria-hidden="true"
                    />

                    <span
                        aria-hidden="true"
                    />
                </button>

                <div
                    id="public-navigation"
                    className={
                        isNavigationOpen
                            ? "public-navigation-panel public-navigation-panel-open"
                            : "public-navigation-panel"
                    }
                >
                    <nav
                        className="public-navigation"
                        aria-label="Navegación principal"
                    >
                        {PUBLIC_NAVIGATION_ITEMS.map(
                            (
                                navigationItem,
                            ) => (
                                <NavLink
                                    key={
                                        navigationItem.to
                                    }
                                    className={
                                        navigationLinkClass
                                    }
                                    to={
                                        navigationItem.to
                                    }
                                    end={
                                        navigationItem.end
                                    }
                                    onClick={
                                        closeNavigation
                                    }
                                >
                                    {
                                        navigationItem.label
                                    }
                                </NavLink>
                            ),
                        )}
                    </nav>

                    <a
                        className="public-header-contact"
                        href={contactUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={
                            closeNavigation
                        }
                    >
                        Solicitar atención
                    </a>
                </div>
            </div>
        </header>
    );
}