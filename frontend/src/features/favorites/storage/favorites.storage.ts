import {
    FAVORITES_STORAGE_KEY,
    FAVORITES_STORAGE_VERSION,
} from "../constants/favorites.constants";

interface FavoritesStoragePayload {
    version: typeof FAVORITES_STORAGE_VERSION;
    productIds: number[];
}

function isValidProductId(
    value: unknown,
): value is number {
    return (
        typeof value === "number" &&
        Number.isInteger(value) &&
        value > 0
    );
}

function normalizeProductIds(
    values: readonly unknown[],
): number[] {
    return Array.from(
        new Set(
            values.filter(
                isValidProductId,
            ),
        ),
    );
}

export function parseFavoriteProductIds(
    rawValue: string | null,
): number[] {
    if (!rawValue) {
        return [];
    }

    try {
        const parsed: unknown =
            JSON.parse(rawValue);

        if (
            typeof parsed !== "object" ||
            parsed === null
        ) {
            return [];
        }

        const payload =
            parsed as Partial<FavoritesStoragePayload>;

        if (
            payload.version !==
                FAVORITES_STORAGE_VERSION ||
            !Array.isArray(
                payload.productIds,
            )
        ) {
            return [];
        }

        return normalizeProductIds(
            payload.productIds,
        );
    } catch {
        return [];
    }
}

export function readFavoriteProductIds():
    number[] {
    try {
        return parseFavoriteProductIds(
            window.localStorage.getItem(
                FAVORITES_STORAGE_KEY,
            ),
        );
    } catch {
        return [];
    }
}

export function writeFavoriteProductIds(
    productIds: readonly number[],
): void {
    try {
        const normalizedProductIds =
            normalizeProductIds(
                productIds,
            );

        if (
            normalizedProductIds.length ===
            0
        ) {
            window.localStorage.removeItem(
                FAVORITES_STORAGE_KEY,
            );

            return;
        }

        const payload: FavoritesStoragePayload = {
            version:
                FAVORITES_STORAGE_VERSION,

            productIds:
                normalizedProductIds,
        };

        window.localStorage.setItem(
            FAVORITES_STORAGE_KEY,
            JSON.stringify(payload),
        );
    } catch {
        // La aplicación continúa funcionando aunque
        // el navegador bloquee el almacenamiento local.
    }
}