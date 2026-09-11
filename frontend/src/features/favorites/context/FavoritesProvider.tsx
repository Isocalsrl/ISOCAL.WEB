import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import {
    FAVORITES_STORAGE_KEY,
} from "../constants/favorites.constants";

import {
    parseFavoriteProductIds,
    readFavoriteProductIds,
    writeFavoriteProductIds,
} from "../storage/favorites.storage";

import {
    FavoritesContext,
    type FavoritesContextValue,
} from "./favorites.context";

interface FavoritesProviderProps {
    children: ReactNode;
}

function productIdListsAreEqual(
    first:
        readonly number[],
    second:
        readonly number[],
): boolean {
    return (
        first.length ===
            second.length &&
        first.every(
            (
                productId,
                index,
            ) =>
                productId ===
                second[index],
        )
    );
}

export function FavoritesProvider({
    children,
}: FavoritesProviderProps) {
    const [
        favoriteProductIds,
        setFavoriteProductIds,
    ] = useState<number[]>(
        readFavoriteProductIds,
    );

    useEffect(() => {
        writeFavoriteProductIds(
            favoriteProductIds,
        );
    }, [
        favoriteProductIds,
    ]);

    useEffect(() => {
        function handleStorage(
            event: StorageEvent,
        ): void {
            if (
                event.key !==
                FAVORITES_STORAGE_KEY
            ) {
                return;
            }

            const nextProductIds =
                parseFavoriteProductIds(
                    event.newValue,
                );

            setFavoriteProductIds(
                (
                    currentProductIds,
                ) =>
                    productIdListsAreEqual(
                        currentProductIds,
                        nextProductIds,
                    )
                        ? currentProductIds
                        : nextProductIds,
            );
        }

        window.addEventListener(
            "storage",
            handleStorage,
        );

        return () => {
            window.removeEventListener(
                "storage",
                handleStorage,
            );
        };
    }, []);

    const favoriteProductIdSet =
        useMemo(
            () =>
                new Set(
                    favoriteProductIds,
                ),
            [
                favoriteProductIds,
            ],
        );

    const isFavorite =
        useCallback(
            (
                productId:
                    number,
            ): boolean =>
                favoriteProductIdSet.has(
                    productId,
                ),
            [
                favoriteProductIdSet,
            ],
        );

    const addFavorite =
        useCallback(
            (
                productId:
                    number,
            ): void => {
                setFavoriteProductIds(
                    (
                        currentProductIds,
                    ) =>
                        currentProductIds.includes(
                            productId,
                        )
                            ? currentProductIds
                            : [
                                  ...currentProductIds,
                                  productId,
                              ],
                );
            },
            [],
        );

    const removeFavorite =
        useCallback(
            (
                productId:
                    number,
            ): void => {
                setFavoriteProductIds(
                    (
                        currentProductIds,
                    ) =>
                        currentProductIds.filter(
                            (
                                currentProductId,
                            ) =>
                                currentProductId !==
                                productId,
                        ),
                );
            },
            [],
        );

    const toggleFavorite =
        useCallback(
            (
                productId:
                    number,
            ): void => {
                setFavoriteProductIds(
                    (
                        currentProductIds,
                    ) =>
                        currentProductIds.includes(
                            productId,
                        )
                            ? currentProductIds.filter(
                                  (
                                      currentProductId,
                                  ) =>
                                      currentProductId !==
                                      productId,
                              )
                            : [
                                  ...currentProductIds,
                                  productId,
                              ],
                );
            },
            [],
        );

    const retainAvailableFavorites =
        useCallback(
            (
                availableProductIds:
                    readonly number[],
            ): void => {
                const availableProductIdSet =
                    new Set(
                        availableProductIds,
                    );

                setFavoriteProductIds(
                    (
                        currentProductIds,
                    ) => {
                        const nextProductIds =
                            currentProductIds.filter(
                                (
                                    productId,
                                ) =>
                                    availableProductIdSet.has(
                                        productId,
                                    ),
                            );

                        return productIdListsAreEqual(
                            currentProductIds,
                            nextProductIds,
                        )
                            ? currentProductIds
                            : nextProductIds;
                    },
                );
            },
            [],
        );

    const value =
        useMemo<FavoritesContextValue>(
            () => ({
                favoriteProductIds,

                favoriteCount:
                    favoriteProductIds.length,

                isFavorite,
                addFavorite,
                removeFavorite,
                toggleFavorite,
                retainAvailableFavorites,
            }),
            [
                favoriteProductIds,
                isFavorite,
                addFavorite,
                removeFavorite,
                toggleFavorite,
                retainAvailableFavorites,
            ],
        );

    return (
        <FavoritesContext.Provider
            value={value}
        >
            {children}
        </FavoritesContext.Provider>
    );
}