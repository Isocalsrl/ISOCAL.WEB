import { NavLink } from "react-router-dom";

import type {
    PublicNavigationItem as PublicNavigationItemModel,
} from "../../constants/publicNavigation";
import {
    PublicNavigationSubmenu,
} from "./PublicNavigationSubmenu";

function navigationLinkClass({
    isActive,
}: {
    isActive: boolean;
}): string {
    return isActive
        ? "public-navigation-link public-navigation-link-active"
        : "public-navigation-link";
}

interface PublicNavigationItemProps {
    item: PublicNavigationItemModel;
    isSubmenuOpen: boolean;
    onClose: () => void;
    onToggleSubmenu: (itemTo: string) => void;
}

export function PublicNavigationItem({
    item,
    isSubmenuOpen,
    onClose,
    onToggleSubmenu,
}: PublicNavigationItemProps) {
    if (!item.children) {
        return (
            <NavLink
                className={navigationLinkClass}
                to={item.to}
                end={item.end}
                onClick={onClose}
            >
                {item.label}
            </NavLink>
        );
    }

    return (
        <div
            className={
                isSubmenuOpen
                    ? "public-navigation-item public-navigation-item-has-children public-navigation-item-open"
                    : "public-navigation-item public-navigation-item-has-children"
            }
        >
            <NavLink
                className={navigationLinkClass}
                to={item.to}
                onClick={onClose}
            >
                {item.label}
                <span
                    className="public-navigation-caret"
                    aria-hidden="true"
                />
            </NavLink>

            <button
                className="public-submenu-toggle"
                type="button"
                aria-label={`${isSubmenuOpen ? "Ocultar" : "Mostrar"} opciones de ${item.label}`}
                aria-expanded={isSubmenuOpen}
                aria-controls="services-navigation-submenu"
                onClick={() => onToggleSubmenu(item.to)}
            >
                <span aria-hidden="true" />
            </button>

            <PublicNavigationSubmenu
                items={item.children}
                onClose={onClose}
            />
        </div>
    );
}
