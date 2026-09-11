interface QuoteEmailTemplateInput {
    customerName: string;
    reference: string;
    companyPhone: string;
    companyEmail: string;
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export function buildQuoteEmail(input: QuoteEmailTemplateInput) {
    const customer = escapeHtml(input.customerName);
    const reference = escapeHtml(input.reference);
    const email = escapeHtml(input.companyEmail);
    const phone = escapeHtml(input.companyPhone);

    return {
        subject: `Cotizacion ${input.reference} - ISOCAL`,
        html: `<div style="font-family:Arial,sans-serif;color:#252a31"><div style="border-top:5px solid #c8102e;padding:24px"><strong style="font-size:24px;color:#c8102e">ISOCAL</strong><p>Estimado(a) ${customer},</p><p>Adjuntamos la cotizacion <strong>${reference}</strong> preparada por el equipo de ISOCAL.</p><p>El documento contiene productos, precios, impuestos, vigencia y condiciones comerciales.</p><p style="padding:16px;background:#f5f6f8;border-left:4px solid #172536"><strong>Referencia</strong><br>${reference}</p><p>Consultas: ${email}<br>${phone}</p></div></div>`,
        text: [
            `Estimado(a) ${input.customerName},`,
            "",
            `Adjuntamos la cotizacion ${input.reference} preparada por el equipo de ISOCAL.`,
            "",
            "El documento contiene productos, precios, impuestos, vigencia y condiciones comerciales.",
            "",
            `Contacto: ${input.companyEmail}`,
            `Telefono: ${input.companyPhone}`,
            "",
            "ISOCAL",
        ].join("\n"),
    };
}
