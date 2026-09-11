import { AppError } from "../../../shared/errors/AppError.js";
import type { AdminRole } from "../../auth/auth.types.js";
import { findAdminQuoteById } from "../repositories/quotes.admin.read.repository.js";
import {
    updatePricing,
    type PricingUpdateRecord,
} from "../repositories/quotes.pricing.repository.js";
import type { QuoteItem, QuotePricingInput } from "../quotes.types.js";
import { fromCents, toCents } from "../utils/money.js";

function requireSuperAdmin(role: AdminRole): void {
    if (role !== "super_admin") {
        throw new AppError(
            403,
            "Solo un superadministrador puede modificar precios.",
            "FORBIDDEN",
        );
    }
}

function nonNegativeMoney(value: number, field: string): number {
    if (!Number.isFinite(value) || value < 0) {
        throw new AppError(
            400,
            `${field} debe ser un importe no negativo.`,
            "VALIDATION_ERROR",
        );
    }

    return toCents(value);
}

export async function applyPricing(
    quoteId: number,
    input: QuotePricingInput,
    actorAdminId: number,
    role: AdminRole,
): Promise<void> {
    requireSuperAdmin(role);

    const current = await findAdminQuoteById(quoteId);

    if (!current) {
        throw new AppError(404, "Cotización no encontrada.", "QUOTE_NOT_FOUND");
    }

    if (![
        "in_review",
        "priced",
        "ready_to_send",
    ].includes(current.quote.status)) {
        throw new AppError(
            409,
            "La cotización no está disponible para pricing.",
            "QUOTE_INVALID_STATE",
        );
    }

    if (input.items.length !== current.items.length) {
        throw new AppError(
            400,
            "Debes enviar el pricing de todos los productos de la cotización.",
            "VALIDATION_ERROR",
        );
    }

    const knownItems = new Map(
        current.items.map((item) => [item.id, item]),
    );
    const seen = new Set<number>();
    const pricedItems: PricingUpdateRecord["items"] = [];
    let subtotalCents = 0;

    for (const item of input.items) {
        const original = knownItems.get(item.itemId);

        if (!original || seen.has(item.itemId)) {
            throw new AppError(
                400,
                "Uno de los productos enviados no pertenece a la cotización.",
                "VALIDATION_ERROR",
            );
        }

        seen.add(item.itemId);

        const unitPriceCents = nonNegativeMoney(
            item.unitPrice,
            "El precio unitario",
        );
        const itemDiscountCents = nonNegativeMoney(
            item.discountAmount ?? 0,
            "El descuento del producto",
        );
        const grossCents = unitPriceCents * original.quantity;

        if (itemDiscountCents > grossCents) {
            throw new AppError(
                400,
                "El descuento de un producto no puede superar su importe.",
                "VALIDATION_ERROR",
            );
        }

        const itemSubtotalCents = grossCents - itemDiscountCents;
        subtotalCents += itemSubtotalCents;

        pricedItems.push({
            itemId: item.itemId,
            unitPrice: fromCents(unitPriceCents),
            discountAmount: fromCents(itemDiscountCents),
            subtotal: fromCents(itemSubtotalCents),
        });
    }

    const discountCents = nonNegativeMoney(
        input.discountAmount ?? 0,
        "El descuento general",
    );

    if (discountCents > subtotalCents) {
        throw new AppError(
            400,
            "El descuento general no puede superar el subtotal.",
            "VALIDATION_ERROR",
        );
    }

    const taxRate = input.taxRate ?? 18;

    if (!Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100) {
        throw new AppError(
            400,
            "El porcentaje de impuesto debe estar entre 0 y 100.",
            "VALIDATION_ERROR",
        );
    }

    const taxableCents = subtotalCents - discountCents;
    const taxCents = Math.round((taxableCents * taxRate) / 100);
    const record: PricingUpdateRecord = {
        items: pricedItems,
        subtotal: fromCents(subtotalCents),
        discountAmount: fromCents(discountCents),
        taxRate,
        taxAmount: fromCents(taxCents),
        total: fromCents(taxableCents + taxCents),
    };

    await updatePricing(quoteId, actorAdminId, record);
}

export interface CalculatedQuotePricing {
    items: Array<{
        itemId: number;
        unitPrice: number;
        discountAmount: number;
        subtotal: number;
    }>;
    subtotal: number;
    discountAmount: number;
    taxRate: number;
    taxAmount: number;
    total: number;
}

export function recalculateStoredQuotePricing(
    storedItems: readonly QuoteItem[],
    discountAmount: number,
    taxRate: number,
): CalculatedQuotePricing {
    let subtotalCents = 0;

    const items = storedItems.map((item) => {
        if (item.unitPrice === null || item.subtotal === null) {
            throw new AppError(
                409,
                `El producto ${item.productName} todavía no tiene un precio definido.`,
                "QUOTE_PRICING_INCOMPLETE",
            );
        }

        const unitPriceCents = nonNegativeMoney(
            item.unitPrice,
            "El precio unitario",
        );
        const itemDiscountCents = nonNegativeMoney(
            item.discountAmount,
            "El descuento del producto",
        );
        const grossCents = unitPriceCents * item.quantity;

        if (itemDiscountCents > grossCents) {
            throw new AppError(
                409,
                `El descuento del producto ${item.productName} no es válido.`,
                "QUOTE_PRICING_INCOMPLETE",
            );
        }

        const itemSubtotalCents = grossCents - itemDiscountCents;
        subtotalCents += itemSubtotalCents;

        return {
            itemId: item.id,
            unitPrice: fromCents(unitPriceCents),
            discountAmount: fromCents(itemDiscountCents),
            subtotal: fromCents(itemSubtotalCents),
        };
    });

    const globalDiscountCents = nonNegativeMoney(
        discountAmount,
        "El descuento general",
    );

    if (globalDiscountCents > subtotalCents) {
        throw new AppError(
            409,
            "El descuento general no puede superar el subtotal.",
            "QUOTE_PRICING_INCOMPLETE",
        );
    }

    if (!Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100) {
        throw new AppError(
            409,
            "El porcentaje de impuesto no es válido.",
            "QUOTE_PRICING_INCOMPLETE",
        );
    }

    const taxCents = Math.round(
        ((subtotalCents - globalDiscountCents) * taxRate) / 100,
    );

    return {
        items,
        subtotal: fromCents(subtotalCents),
        discountAmount: fromCents(globalDiscountCents),
        taxRate,
        taxAmount: fromCents(taxCents),
        total: fromCents(subtotalCents - globalDiscountCents + taxCents),
    };
}
