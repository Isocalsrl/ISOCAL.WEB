import {
    createPersistedProductIdsStorage,
} from "../../../shared/storage/persistedProductIds";

import {
    FAVORITES_STORAGE_KEY,
    FAVORITES_STORAGE_VERSION,
} from "../constants/favorites.constants";

export const favoritesProductIdStorage =
    createPersistedProductIdsStorage({
        storageKey: FAVORITES_STORAGE_KEY,
        version: FAVORITES_STORAGE_VERSION,
    });

export const parseFavoriteProductIds =
    favoritesProductIdStorage.parse;
export const readFavoriteProductIds =
    favoritesProductIdStorage.read;
export const writeFavoriteProductIds =
    favoritesProductIdStorage.write;
