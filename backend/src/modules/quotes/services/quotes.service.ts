import { AppError } from "../../../shared/errors/AppError.js";
import { createQuoteWithItems } from "../repositories/quotes.create.repository.js";
import {
    findActiveProductsByIds,
    reserveQuoteReferenceNumber,
} from "../repositories/quotes.read.repository.js";
import type {
    CreateQuoteInput,
    PublicQuoteReceipt,
    QuoteProductSnapshot,
} from "../quotes.types.js";
import { buildQuoteReference } from "../utils/quoteReference.js";
import { normalizeCreateQuoteInput } from "./quotes.normalizer.js";

function buildProductSnapshotMap(
    products: readonly QuoteProductSnapshot[],
): Map<number, QuoteProductSnapshot> {
    return new Map(products.map((product) => [product.id, product]));
}

export async function createPublicQuote(
    input: CreateQuoteInput,
): Promise<PublicQuoteReceipt> {
    const normalizedInput = normalizeCreateQuoteInput(input);
    const productIds = normalizedInput.items.map((item) => item.productId);
    const products = await findActiveProductsByIds(productIds);
    const productsById = buildProductSnapshotMap(products);
    const unavailableProductIds = productIds.filter(
        (productId) => !productsById.has(productId),
    );

    if (unavailableProductIds.length > 0) {
        throw new AppError(
            400,
            "Uno o más productos ya no están disponibles para solicitar cotización.",
            "QUOTE_PRODUCTS_UNAVAILABLE",
            { productIds: unavailableProductIds },
        );
    }

    const referenceNumber = await reserveQuoteReferenceNumber();
    const quote = await createQuoteWithItems({
        reference: buildQuoteReference(referenceNumber),
        customerName: normalizedInput.customer.fullName,
        customerEmail: normalizedInput.customer.email,
        customerPhone: normalizedInput.customer.phone,
        companyName: normalizedInput.customer.companyName,
        ruc: normalizedInput.customer.ruc,
        jobTitle: normalizedInput.customer.jobTitle,
        location: normalizedInput.customer.location,
        customerNotes: normalizedInput.customer.notes,
        items: normalizedInput.items.map((item) => ({
            productId: item.productId,
            productName: productsById.get(item.productId)!.name,
            quantity: item.quantity,
            customerNotes: item.notes,
        })),
    });

    return {
        reference: quote.reference,
        status: "pending",
        createdAt: quote.createdAt,
    };
}
