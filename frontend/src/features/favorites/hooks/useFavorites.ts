import {
    useContext,
} from "react";

import {
    FavoritesContext,
} from "../context/favorites.context";

export function useFavorites() {
    const context =
        useContext(
            FavoritesContext,
        );

    if (!context) {
        throw new Error(
            "useFavorites debe utilizarse dentro de FavoritesProvider.",
        );
    }

    return context;
}