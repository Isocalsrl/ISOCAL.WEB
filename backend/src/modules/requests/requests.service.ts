import { createHash, randomUUID } from "node:crypto";
import { env } from "../../config/env.js";
import { emailService } from "../../shared/email/emailService.js";
import { AppError } from "../../shared/errors/AppError.js";
import { createAndSendAutomaticQuote } from "../quotes/quotes.service.js";
import { findRequestedProducts } from "./requests.repository.js";
import { requestMessage } from "./requests.message.js";
import type { RequestReceipt, RequestSubmission } from "./requests.types.js";

const submissions = new Map<
    string,
    { hash: string; expiresAt: number; result: Promise<RequestReceipt> }
>();

async function deliver(input: RequestSubmission): Promise<RequestReceipt> {
    if (!env.emailFrom || !env.resendApiKey) {
        throw new AppError(503, "El envío por correo no está disponible. Inténtalo nuevamente más tarde.", "EMAIL_UNAVAILABLE");
    }

    const products = await findRequestedProducts(input.items.map((item) => item.productId));
    if (products.length !== input.items.length) {
        throw new AppError(400, "Un producto ya no está disponible. Revisa tu selección.", "PRODUCT_UNAVAILABLE");
    }

    const createdAt = new Date();
    const referenceToken = input.requestId
        ? createHash("sha256").update(input.requestId).digest("hex").slice(0, 8).toUpperCase()
        : randomUUID().slice(0, 8).toUpperCase();
    const reference = `${input.kind === "complaint" ? "REC" : "SOL"}-${createdAt.getUTCFullYear()}-${referenceToken}`;
    const document = {
        reference,
        createdAt,
        customer: input.customer,
        items: input.items.map((item) => ({
            name: products.find((product) => product.id === item.productId)!.name,
            quantity: item.quantity,
            notes: item.notes,
        })),
    };

    const message = requestMessage(input, document);

    if (input.kind === "quotation") {
        const delivery = await createAndSendAutomaticQuote({
            reference,
            customer: input.customer,
            items: input.items.map((item) => ({
                productId: item.productId,
                productName: products.find((product) => product.id === item.productId)!.name,
                quantity: item.quantity,
                notes: item.notes,
            })),
        });

        return {
            reference,
            receipt: message.text,
            document: delivery.document,
        };
    }

    const customerEmail = input.customer.email.trim();
    try {
        await emailService.send({
            from: env.emailFrom,
            to: [env.companyEmail],
            replyTo: customerEmail,
            subject:
                input.kind === "complaint"
                    ? `Libro de reclamaciones ISOCAL · ${reference}`
                    : `Consulta ISOCAL · ${reference}`,
            ...message,
        });
    } catch {
        throw new AppError(502, "La solicitud quedó registrada, pero no se pudo enviar el correo de confirmación.", "EMAIL_SEND_FAILED");
    }

    return { reference, receipt: message.text };
}

export function sendRequest(input: RequestSubmission): Promise<RequestReceipt> {
    if (!input.requestId) return deliver(input);

    const now = Date.now();
    for (const [key, value] of submissions) {
        if (value.expiresAt <= now) submissions.delete(key);
    }

    const hash = createHash("sha256").update(JSON.stringify(input)).digest("hex");
    const previous = submissions.get(input.requestId);
    if (previous) {
        if (previous.hash !== hash) {
            throw new AppError(409, "Esta solicitud cambió. Vuelve a enviarla con una referencia nueva.", "REQUEST_ID_CONFLICT");
        }
        return previous.result;
    }

    if (submissions.size >= 500) {
        throw new AppError(503, "Estamos atendiendo muchas solicitudes. Inténtalo más tarde.", "REQUEST_CAPACITY");
    }

    const key = input.requestId;
    const result = deliver(input).catch((error) => {
        submissions.delete(key);
        throw error;
    });
    submissions.set(key, { hash, result, expiresAt: now + 15 * 60 * 1000 });
    return result;
}
