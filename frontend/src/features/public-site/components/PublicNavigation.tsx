import {
    PUBLIC_NAVIGATION_ITEMS,
} from "../constants/publicNavigation";
import {
    PublicNavigationItem,
} from "./navigation/PublicNavigationItem";

interface PublicNavigationProps {
    openSubmenu: string | null;
    onClose: () => void;
    onToggleSubmenu: (itemTo: string) => void;
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
            {PUBLIC_NAVIGATION_ITEMS.map((item) => (
                <PublicNavigationItem
                    key={item.to}
                    item={item}
                    isSubmenuOpen={openSubmenu === item.to}
                    onClose={onClose}
                    onToggleSubmenu={onToggleSubmenu}
                />
            ))}
        </nav>
    );
}
