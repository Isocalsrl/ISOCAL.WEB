import {
    QUOTATION_STORAGE_KEY,
    QUOTATION_STORAGE_VERSION,
} from "../constants/quotation.constants";

interface QuotationStoragePayload {
    version: typeof QUOTATION_STORAGE_VERSION;
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

export function parseQuotationProductIds(
    rawValue: string | null,
): number[] {
    if (!rawValue) {
        return [];
    }

    try {
        const parsed: unknown =
            JSON.parse(rawValue);

        if (
            typeof parsed !==
                "object" ||
            parsed === null
        ) {
            return [];
        }

        const payload =
            parsed as Partial<QuotationStoragePayload>;

        if (
            payload.version !==
                QUOTATION_STORAGE_VERSION ||
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

export function readQuotationProductIds():
    number[] {
    try {
        return parseQuotationProductIds(
            window.localStorage.getItem(
                QUOTATION_STORAGE_KEY,
            ),
        );
    } catch {
        return [];
    }
}

export function writeQuotationProductIds(
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
                QUOTATION_STORAGE_KEY,
            );

            return;
        }

        const payload: QuotationStoragePayload = {
            version:
                QUOTATION_STORAGE_VERSION,

            productIds:
                normalizedProductIds,
        };

        window.localStorage.setItem(
            QUOTATION_STORAGE_KEY,
            JSON.stringify(payload),
        );
    } catch {
        // La aplicación debe continuar funcionando
        // aunque localStorage no esté disponible.
    }
}