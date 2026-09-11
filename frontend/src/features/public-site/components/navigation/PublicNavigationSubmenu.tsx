import { NavLink } from "react-router-dom";

import type {
    PublicNavigationChild,
} from "../../constants/publicNavigation";

interface PublicNavigationSubmenuProps {
    items: readonly PublicNavigationChild[];
    onClose: () => void;
}

export function PublicNavigationSubmenu({
    items,
    onClose,
}: PublicNavigationSubmenuProps) {
    return (
        <div
            id="services-navigation-submenu"
            className="public-navigation-submenu"
        >
            <p className="public-navigation-submenu-title">
                Áreas de servicio
            </p>

            {items.map((child) => (
                <NavLink
                    key={child.to}
                    className="public-navigation-submenu-link"
                    to={child.to}
                    onClick={onClose}
                >
                    <span>{child.label}</span>
                    <small>{child.description}</small>
                </NavLink>
            ))}

            <NavLink
                className="public-navigation-submenu-all"
                to="/servicios"
                onClick={onClose}
            >
                Ver todos los servicios
                <span aria-hidden="true">→</span>
            </NavLink>
        </div>
    );
}
