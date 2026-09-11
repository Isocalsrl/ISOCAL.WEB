import {
    NavLink,
} from "react-router-dom";

import {
    useFavorites,
} from "../hooks/useFavorites";

import {
    FavoriteIcon,
} from "./FavoriteIcon";

interface FavoritesHeaderLinkProps {
    onNavigate:
        () => void;
}

export function FavoritesHeaderLink({
    onNavigate,
}: FavoritesHeaderLinkProps) {
    const {
        favoriteCount,
    } = useFavorites();

    return (
        <NavLink
            className={({
                isActive,
            }) =>
                isActive
                    ? "favorites-header-link favorites-header-link-active"
                    : "favorites-header-link"
            }
            to="/favoritos"
            onClick={
                onNavigate
            }
            aria-label={`Favoritos: ${favoriteCount} ${
                favoriteCount === 1
                    ? "producto guardado"
                    : "productos guardados"
            }`}
        >
            <FavoriteIcon
                isFilled={
                    favoriteCount > 0
                }
            />

            <span className="favorites-header-label">
                Favoritos
            </span>

            <span
                className="favorites-header-count"
                aria-hidden="true"
            >
                {favoriteCount}
            </span>
        </NavLink>
    );
}