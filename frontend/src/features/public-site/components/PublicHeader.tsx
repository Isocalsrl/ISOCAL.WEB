import {
    useCallback,
    useEffect,
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

    const [
        openSubmenu,
        setOpenSubmenu,
    ] = useState<string | null>(null);

    const closeNavigation =
        useCallback((): void => {
            setIsNavigationOpen(false);
            setOpenSubmenu(null);
        }, []);

    useEffect(() => {
        function closeOnEscape(
            event: KeyboardEvent,
        ): void {
            if (event.key === "Escape") {
                closeNavigation();
            }
        }

        document.addEventListener(
            "keydown",
            closeOnEscape,
        );

        return () => {
            document.removeEventListener(
                "keydown",
                closeOnEscape,
            );
        };
    }, [closeNavigation]);

    return (
        <header className="public-header">
            <div className="public-container public-header-content">
                <BrandMark
                    imageSrc="/images/brand/isocal-logo.svg"
                    onNavigate={closeNavigation}
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
                    aria-expanded={isNavigationOpen}
                    onClick={() => {
                        setIsNavigationOpen(
                            (currentValue) =>
                                !currentValue,
                        );
                    }}
                >
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
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
                            (navigationItem) => {
                                if (
                                    !navigationItem.children
                                ) {
                                    return (
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
                                    );
                                }

                                const isSubmenuOpen =
                                    openSubmenu ===
                                    navigationItem.to;

                                return (
                                    <div
                                        key={
                                            navigationItem.to
                                        }
                                        className={
                                            isSubmenuOpen
                                                ? "public-navigation-item public-navigation-item-has-children public-navigation-item-open"
                                                : "public-navigation-item public-navigation-item-has-children"
                                        }
                                    >
                                        <NavLink
                                            className={
                                                navigationLinkClass
                                            }
                                            to={
                                                navigationItem.to
                                            }
                                            onClick={
                                                closeNavigation
                                            }
                                        >
                                            {
                                                navigationItem.label
                                            }

                                            <span
                                                className="public-navigation-caret"
                                                aria-hidden="true"
                                            />
                                        </NavLink>

                                        <button
                                            className="public-submenu-toggle"
                                            type="button"
                                            aria-label={`${
                                                isSubmenuOpen
                                                    ? "Ocultar"
                                                    : "Mostrar"
                                            } opciones de ${
                                                navigationItem.label
                                            }`}
                                            aria-expanded={
                                                isSubmenuOpen
                                            }
                                            aria-controls="services-navigation-submenu"
                                            onClick={() => {
                                                setOpenSubmenu(
                                                    isSubmenuOpen
                                                        ? null
                                                        : navigationItem.to,
                                                );
                                            }}
                                        >
                                            <span
                                                aria-hidden="true"
                                            />
                                        </button>

                                        <div
                                            id="services-navigation-submenu"
                                            className="public-navigation-submenu"
                                        >
                                            <p className="public-navigation-submenu-title">
                                                Áreas de
                                                servicio
                                            </p>

                                            {
                                                navigationItem.children.map(
                                                    (
                                                        child,
                                                    ) => (
                                                        <NavLink
                                                            key={
                                                                child.to
                                                            }
                                                            className="public-navigation-submenu-link"
                                                            to={
                                                                child.to
                                                            }
                                                            onClick={
                                                                closeNavigation
                                                            }
                                                        >
                                                            <span>
                                                                {
                                                                    child.label
                                                                }
                                                            </span>

                                                            <small>
                                                                {
                                                                    child.description
                                                                }
                                                            </small>
                                                        </NavLink>
                                                    ),
                                                )
                                            }

                                            <NavLink
                                                className="public-navigation-submenu-all"
                                                to="/servicios"
                                                onClick={
                                                    closeNavigation
                                                }
                                            >
                                                Ver todos los
                                                servicios

                                                <span
                                                    aria-hidden="true"
                                                >
                                                    →
                                                </span>
                                            </NavLink>
                                        </div>
                                    </div>
                                );
                            },
                        )}
                    </nav>

                    <a
                        className="public-header-contact"
                        href={contactUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeNavigation}
                    >
                        Solicitar atención
                    </a>
                </div>
            </div>
        </header>
    );
}