import { useMemo, type ReactNode } from "react";
import { usePersistedProductIds } from "../../../shared/hooks/usePersistedProductIds";
import { favoritesProductIdStorage } from "../storage/favorites.storage";
import { FavoritesContext, type FavoritesContextValue } from "./favorites.context";

interface FavoritesProviderProps {
    children: ReactNode;
}

export function FavoritesProvider({
    children,
}: FavoritesProviderProps) {
    const {
        productIds,
        count,
        has,
        add,
        remove,
        toggle,
        retainAvailable,
    } = usePersistedProductIds(
        favoritesProductIdStorage,
    );

    const value = useMemo<FavoritesContextValue>(
        () => ({
            favoriteProductIds: productIds,
            favoriteCount: count,
            isFavorite: has,
            addFavorite: add,
            removeFavorite: remove,
            toggleFavorite: toggle,
            retainAvailableFavorites: retainAvailable,
        }),
        [
            add,
            count,
            has,
            productIds,
            remove,
            retainAvailable,
            toggle,
        ],
    );

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}
