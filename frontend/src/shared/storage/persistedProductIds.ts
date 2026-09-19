export interface PersistedProductIdsStorage {
    storageKey: string;
    parse: (rawValue: string | null) => number[];
    read: () => number[];
    write: (productIds: readonly number[]) => void;
}

interface PersistedProductIdsPayload {
    version: number;
    productIds: number[];
}

function isValidProductId(value: unknown): value is number {
    return (
        typeof value === "number" &&
        Number.isInteger(value) &&
        value > 0
    );
}

export function normalizeProductIds(
    values: readonly unknown[],
): number[] {
    return Array.from(new Set(values.filter(isValidProductId)));
}

export function productIdListsAreEqual(
    first: readonly number[],
    second: readonly number[],
): boolean {
    return (
        first.length === second.length &&
        first.every((productId, index) => productId === second[index])
    );
}

export function createPersistedProductIdsStorage(config: {
    storageKey: string;
    version: number;
}): PersistedProductIdsStorage {
    function parse(rawValue: string | null): number[] {
        if (!rawValue) {
            return [];
        }

        try {
            const parsed: unknown = JSON.parse(rawValue);

            if (typeof parsed !== "object" || parsed === null) {
                return [];
            }

            const payload = parsed as Partial<PersistedProductIdsPayload>;

            if (
                payload.version !== config.version ||
                !Array.isArray(payload.productIds)
            ) {
                return [];
            }

            return normalizeProductIds(payload.productIds);
        } catch {
            return [];
        }
    }

    function read(): number[] {
        if (typeof window === "undefined") {
            return [];
        }

        try {
            return parse(window.localStorage.getItem(config.storageKey));
        } catch {
            return [];
        }
    }

    function write(productIds: readonly number[]): void {
        if (typeof window === "undefined") {
            return;
        }

        try {
            const normalizedProductIds = normalizeProductIds(productIds);

            if (normalizedProductIds.length === 0) {
                window.localStorage.removeItem(config.storageKey);
                return;
            }

            const payload: PersistedProductIdsPayload = {
                version: config.version,
                productIds: normalizedProductIds,
            };

            window.localStorage.setItem(
                config.storageKey,
                JSON.stringify(payload),
            );
        } catch {

        }
    }

    return {
        storageKey: config.storageKey,
        parse,
        read,
        write,
    };
}
