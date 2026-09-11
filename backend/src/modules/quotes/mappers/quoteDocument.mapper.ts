import { env } from "../../../config/env.js";
import { AppError } from "../../../shared/errors/AppError.js";
import { fromCents, toCents } from "../utils/money.js";
import type { QuoteDocumentData } from "../quoteDocument.types.js";
import type { Quote, QuoteItem } from "../quotes.types.js";

export function mapQuoteToDocument(quote: Quote, items: readonly QuoteItem[], issuedAt: Date): QuoteDocumentData {
    if (!env.companyLegalName || !env.companyRuc) throw new AppError(500, "Falta configurar la razón social o el RUC de ISOCAL para generar documentos.", "QUOTE_COMPANY_CONFIG_MISSING");
    if (!quote.validUntil || !quote.paymentTerms || quote.taxAmount === null || quote.total === null || quote.subtotal === null) throw new AppError(409, "La cotización todavía no contiene toda la información comercial necesaria.", "QUOTE_DOCUMENT_DATA_INCOMPLETE");
    const mappedItems = items.map((item) => { if (item.unitPrice === null || item.subtotal === null) throw new AppError(409, `El producto ${item.productName} todavía no tiene pricing completo.`, "QUOTE_PRICING_INCOMPLETE"); return { productName: item.productName, quantity: item.quantity, customerNotes: item.customerNotes, unitPrice: item.unitPrice, discountAmount: item.discountAmount, subtotal: item.subtotal }; });
    const grossSubtotalCents = mappedItems.reduce((sum, item) => sum + toCents(item.unitPrice) * item.quantity, 0);
    const itemDiscountCents = mappedItems.reduce((sum, item) => sum + toCents(item.discountAmount), 0);
    const globalDiscountCents = toCents(quote.discountAmount);
    return {
        company: { legalName: env.companyLegalName, ruc: env.companyRuc, phone: env.companyPhone, email: env.companyEmail, website: env.companyWebsite, address: env.companyAddress },
        reference: quote.reference, issuedAt, validUntil: quote.validUntil, currency: quote.currency,
        customer: { name: quote.customerName, companyName: quote.companyName, ruc: quote.ruc, email: quote.customerEmail, phone: quote.customerPhone },
        items: mappedItems,
        financial: { grossSubtotal: fromCents(grossSubtotalCents), itemDiscountAmount: fromCents(itemDiscountCents), globalDiscountAmount: fromCents(globalDiscountCents), totalDiscountAmount: fromCents(itemDiscountCents + globalDiscountCents), taxableSubtotal: quote.subtotal - quote.discountAmount, taxRate: quote.taxRate, taxAmount: quote.taxAmount, total: quote.total },
        paymentTerms: quote.paymentTerms, commercialNotes: quote.commercialNotes,
    };
}
