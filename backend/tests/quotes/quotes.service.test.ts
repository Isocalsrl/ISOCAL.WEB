import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    createQuote: vi.fn(),
    findQuoteById: vi.fn(),
    saveGeneratedDocument: vi.fn(),
    createEmailDelivery: vi.fn(),
    markEmailDeliverySent: vi.fn(),
    markEmailDeliveryFailed: vi.fn(),
    storageSave: vi.fn(),
    storageRead: vi.fn(),
    emailSend: vi.fn(),
    pdf: vi.fn(),
}));

vi.mock("../../src/modules/quotes/quotes.repository.js", () => ({
    createQuote: mocks.createQuote,
    findQuoteById: mocks.findQuoteById,
    saveGeneratedDocument: mocks.saveGeneratedDocument,
    createEmailDelivery: mocks.createEmailDelivery,
    markEmailDeliverySent: mocks.markEmailDeliverySent,
    markEmailDeliveryFailed: mocks.markEmailDeliveryFailed,
}));
vi.mock("../../src/shared/storage/storageService.js", () => ({
    binaryStorage: { save: mocks.storageSave, read: mocks.storageRead },
}));
vi.mock("../../src/shared/storage/providers/localFileStorage.provider.js", () => ({
    buildStorageKey: () => "quotes/44/commercial_quote/test.pdf",
}));
vi.mock("../../src/shared/email/emailService.js", () => ({
    emailService: { send: mocks.emailSend },
}));
vi.mock("../../src/modules/quotes/documents/commercialQuotePdf.js", () => ({
    createCommercialQuotePdf: mocks.pdf,
}));

import { env } from "../../src/config/env.js";
import { createAndSendAutomaticQuote } from "../../src/modules/quotes/quotes.service.js";

const storedInput = {
    reference: "SOL-2026-TEST",
    customer: {
        fullName: "Cliente Prueba",
        email: "cliente@example.com",
        phone: "999999999",
        notes: "Necesito cotizar el equipo",
    },
    items: [{ productId: 15, productName: "Equipo oficial", quantity: 2, notes: null }],
};

const quote = {
    id: 44,
    reference: storedInput.reference,
    customerName: "Cliente Prueba",
    customerEmail: "cliente@example.com",
    customerPhone: "999999999",
    companyName: null,
    ruc: null,
    jobTitle: null,
    location: null,
    customerNotes: "Necesito cotizar el equipo",
    status: "pending" as const,
    subtotal: null,
    discountAmount: 0 as const,
    taxRate: 18 as const,
    taxAmount: null,
    total: null,
    currency: "PEN" as const,
    validUntil: null,
    paymentTerms: null,
    commercialNotes: null,
    internalNotes: null,
    pricedAt: null,
    createdAt: new Date("2026-09-17T12:00:00-05:00"),
    updatedAt: new Date("2026-09-17T12:00:00-05:00"),
    sentAt: null,
    items: [{
        id: 1,
        productId: 15,
        productName: "Equipo oficial",
        productDescription: "Equipo de prueba",
        quantity: 2,
        customerNotes: null,
        unitPrice: null,
        discountAmount: 0 as const,
        subtotal: null,
        imageStorageKey: null,
    }],
};

describe("cotización automática", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        env.emailFrom = "ISOCAL <cotizaciones@example.com>";
        env.emailReplyTo = "ventas@example.com";
        env.companyEmail = "contacto@example.com";
        env.resendApiKey = "test-key";
        env.quotationInternalEmail = "ventas@example.com";
        mocks.createQuote.mockResolvedValue(44);
        mocks.findQuoteById.mockResolvedValue(quote);
        mocks.pdf.mockResolvedValue(Buffer.from("%PDF-1.7 automatic-quote"));
        mocks.storageSave.mockResolvedValue({
            key: "quotes/44/commercial_quote/test.pdf",
            sizeBytes: 25,
            sha256: "a".repeat(64),
        });
        mocks.saveGeneratedDocument.mockResolvedValue(90);
        mocks.createEmailDelivery.mockResolvedValue(120);
        mocks.emailSend.mockResolvedValue({ provider: "mock", messageId: "msg-1" });
    });

    it("envía el PDF directamente al cliente y copia al correo interno configurado", async () => {
        const result = await createAndSendAutomaticQuote(storedInput);
        const message = mocks.emailSend.mock.calls[0][0];

        expect(message.to).toEqual(["cliente@example.com"]);
        expect(message.bcc).toEqual(["ventas@example.com"]);
        expect(message.replyTo).toBe("ventas@example.com");
        expect(message.attachments).toHaveLength(1);
        expect(message.attachments[0].filename).toBe("Cotizacion-ISOCAL.pdf");
        expect(message.attachments[0].content.subarray(0, 4).toString()).toBe("%PDF");
        expect(result.document.contentBase64).toBe(message.attachments[0].content.toString("base64"));
        expect(mocks.markEmailDeliverySent).toHaveBeenCalledOnce();
    });

    it("si no existe correo interno, envía únicamente al cliente", async () => {
        env.quotationInternalEmail = null;
        await createAndSendAutomaticQuote(storedInput);
        const message = mocks.emailSend.mock.calls[0][0];

        expect(message.to).toEqual(["cliente@example.com"]);
        expect(message.bcc).toBeUndefined();
    });
});
