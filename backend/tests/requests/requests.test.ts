import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

const mocks = vi.hoisted(() => ({
    send: vi.fn(),
    query: vi.fn(),
    automaticQuote: vi.fn(),
}));

vi.mock("../../src/shared/email/emailService.js", () => ({ emailService: { send: mocks.send } }));
vi.mock("../../src/database/db.js", () => ({ db: { query: mocks.query } }));
vi.mock("../../src/modules/quotes/quotes.service.js", () => ({
    createAndSendAutomaticQuote: mocks.automaticQuote,
}));

import app from "../../src/app.js";
import { env } from "../../src/config/env.js";

const payload = () => ({
    kind: "contact",
    consent: true,
    customer: {
        fullName: "Cliente <script>",
        email: "cliente@example.com",
        phone: "+51 999 999 999",
        notes: "Calibración de equipos",
    },
    items: [],
});

describe("solicitudes por correo", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        env.emailFrom = "ISOCAL <test@example.com>";
        env.resendApiKey = "test-only";
        env.companyEmail = "ventas@example.com";
        env.emailReplyTo = "ventas@example.com";
        env.quotationInternalEmail = "cotizaciones@example.com";
        mocks.send.mockResolvedValue({ provider: "mock", messageId: "message-1" });
        mocks.query.mockResolvedValue({ rows: [{ id: 15, name: "Equipo oficial" }] });
        mocks.automaticQuote.mockResolvedValue({
            quoteId: 44,
            messageId: "quote-message-1",
            document: {
                filename: "Cotizacion-ISOCAL.pdf",
                contentBase64: Buffer.from("%PDF-test").toString("base64"),
                mimeType: "application/pdf",
            },
        });
    });

    it("envía una consulta sin productos al correo comercial", async () => {
        const res = await request(app).post("/api/requests").send(payload());
        expect(res.status).toBe(201);
        expect(res.body.data.reference).toMatch(/^SOL-/);
        expect(mocks.query).not.toHaveBeenCalled();
        expect(mocks.send.mock.calls[0][0]).toMatchObject({
            to: ["ventas@example.com"],
            replyTo: "cliente@example.com",
        });
        expect(mocks.send.mock.calls[0][0].html).not.toContain("<script>");
        expect(mocks.send.mock.calls[0][0].html).toContain("&lt;script&gt;");
    });

    it("incluye nombres del catálogo y cantidades en una consulta", async () => {
        const res = await request(app).post("/api/requests").send({
            ...payload(),
            items: [{ productId: 15, quantity: 3, notes: "Rango de laboratorio" }],
        });
        expect(res.status).toBe(201);
        expect(mocks.send.mock.calls[0][0].text).toContain("3 × Equipo oficial - Rango de laboratorio");
        expect(mocks.query).toHaveBeenCalledOnce();
    });

    it("rechaza productos que ya no están activos", async () => {
        mocks.query.mockResolvedValue({ rows: [] });
        const res = await request(app).post("/api/requests").send({
            ...payload(),
            items: [{ productId: 15, quantity: 1 }],
        });
        expect(res.status).toBe(400);
        expect(mocks.send).not.toHaveBeenCalled();
        expect(mocks.automaticQuote).not.toHaveBeenCalled();
    });

    it("rechaza datos inválidos y consentimiento ausente", async () => {
        const res = await request(app).post("/api/requests").send({ ...payload(), consent: false });
        expect(res.status).toBe(400);
        expect(mocks.send).not.toHaveBeenCalled();
    });

    it("no informa éxito si falta la configuración del proveedor", async () => {
        env.resendApiKey = null;
        const res = await request(app).post("/api/requests").send(payload());
        expect(res.status).toBe(503);
        expect(mocks.send).not.toHaveBeenCalled();
    });

    it("devuelve un error recuperable si falla el correo de una consulta", async () => {
        mocks.send.mockRejectedValue(new Error("provider failure"));
        const res = await request(app).post("/api/requests").send(payload());
        expect(res.status).toBe(502);
        expect(res.body.success).toBe(false);
    });

    it("envía una hoja de reclamación completa", async () => {
        const res = await request(app).post("/api/requests").send({
            ...payload(),
            kind: "complaint",
            complaint: {
                type: "Reclamo",
                document: "12345678",
                address: "Dirección del consumidor",
                product: "Equipo de laboratorio",
                amount: "250.50",
                request: "Solicito revisión del equipo",
            },
        });
        expect(res.status).toBe(201);
        expect(res.body.data.reference).toMatch(/^REC-/);
        expect(res.body.data.receipt).toContain("250.50");
        expect(res.body.data.receipt).toContain("Solicito revisión");
    });

    it("delega la cotización al flujo automático y devuelve el mismo PDF", async () => {
        const res = await request(app).post("/api/requests").send({
            ...payload(),
            kind: "quotation",
            items: [{ productId: 15, quantity: 2, notes: "Uso industrial" }],
        });

        expect(res.status).toBe(201);
        expect(mocks.automaticQuote).toHaveBeenCalledOnce();
        expect(mocks.automaticQuote.mock.calls[0][0]).toMatchObject({
            customer: expect.objectContaining({ email: "cliente@example.com" }),
            items: [{ productId: 15, productName: "Equipo oficial", quantity: 2, notes: "Uso industrial" }],
        });
        expect(res.body.data.document.filename).toBe("Cotizacion-ISOCAL.pdf");
        expect(res.body.data.document.contentBase64).toBe(Buffer.from("%PDF-test").toString("base64"));
        expect(mocks.send).not.toHaveBeenCalled();
    });

    it("rechaza reclamaciones incompletas", async () => {
        const res = await request(app).post("/api/requests").send({
            ...payload(),
            kind: "complaint",
            complaint: { type: "Reclamo" },
        });
        expect(res.status).toBe(400);
        expect(mocks.send).not.toHaveBeenCalled();
    });

    it("mantiene retirados los endpoints del flujo administrativo anterior", async () => {
        expect((await request(app).get("/api/admin/quotes")).status).toBe(404);
        expect((await request(app).post("/api/quotes").send(payload())).status).toBe(404);
    });
});
