import { describe, expect, it } from "vitest";
import { buildQuoteEmail } from "../../src/modules/quotes/templates/quoteEmail.template.js";
import { renderQuoteDocument } from "../../src/modules/quotes/templates/quoteDocument.template.js";

const documentData = {
    company: { legalName: "ISOCAL S.A.C.", ruc: "20123456789", phone: "+51 999 999 999", email: "ventas@isocal.pe", website: "https://www.isocal.pe", address: null },
    reference: "COT-2026-000001",
    issuedAt: new Date("2026-09-11T12:00:00Z"),
    validUntil: "2026-10-11",
    currency: "PEN",
    customer: { name: "Cliente", companyName: "Empresa", ruc: "20987654321", email: "cliente@example.com", phone: "+51 988 888 888" },
    items: [{ productName: "Producto de prueba", quantity: 2, customerNotes: null, unitPrice: 100, discountAmount: 0, subtotal: 200 }],
    financial: { grossSubtotal: 200, itemDiscountAmount: 0, globalDiscountAmount: 0, totalDiscountAmount: 0, taxableSubtotal: 200, taxRate: 18, taxAmount: 36, total: 236 },
    paymentTerms: "Contado",
    commercialNotes: null,
};

describe("quote document", () => {
    it("genera un PDF desde datos documentales", async () => {
        const pdf = await renderQuoteDocument(documentData);
        expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
        expect(pdf.byteLength).toBeGreaterThan(0);
    });

    it("escapa contenido controlado por el cliente en el correo HTML", () => {
        const email = buildQuoteEmail({ customerName: "<script>alert(1)</script>", reference: "COT-1", companyPhone: "123", companyEmail: "ventas@example.com" });
        expect(email.html).not.toContain("<script>");
        expect(email.html).toContain("&lt;script&gt;");
    });
});
