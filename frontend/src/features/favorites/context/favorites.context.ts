import { createContext } from "react";

export interface FavoritesContextValue {
    favoriteProductIds:
        readonly number[];

    favoriteCount:
        number;

    isFavorite:
        (
            productId:
                number,
        ) => boolean;

    addFavorite:
        (
            productId:
                number,
        ) => void;

    removeFavorite:
        (
            productId:
                number,
        ) => void;

    toggleFavorite:
        (
            productId:
                number,
        ) => void;

    retainAvailableFavorites:
        (
            availableProductIds:
                readonly number[],
        ) => void;
}

export const FavoritesContext =
    createContext<FavoritesContextValue | null>(
        null,
    );
