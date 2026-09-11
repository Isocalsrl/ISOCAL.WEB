import {
    NavLink,
} from "react-router-dom";

import {
    PUBLIC_NAVIGATION_ITEMS,
} from "../constants/publicNavigation";

function navigationLinkClass({
    isActive,
}: {
    isActive:
        boolean;
}): string {
    return isActive
        ? "public-navigation-link public-navigation-link-active"
        : "public-navigation-link";
}

interface PublicNavigationProps {
    openSubmenu:
        string | null;

    onClose:
        () => void;

    onToggleSubmenu:
        (
            itemTo:
                string,
        ) => void;
}

export function PublicNavigation({
    openSubmenu,
    onClose,
    onToggleSubmenu,
}: PublicNavigationProps) {
    return (
        <nav
            className="public-navigation"
            aria-label="Navegación principal"
        >
            {PUBLIC_NAVIGATION_ITEMS.map(
                (
                    navigationItem,
                ) => {
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
                                    onClose
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
                                    onClose
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
                                    onToggleSubmenu(
                                        navigationItem.to,
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
                                                    onClose
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
                                        onClose
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
    );
}
