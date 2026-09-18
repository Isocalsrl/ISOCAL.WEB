import { env } from "../../config/env.js";
import type { RequestDocument, RequestSubmission } from "./requests.types.js";

const escapeHtml = (value: string) =>
    value.replace(
        /[&<>"']/g,
        (character) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[character]!,
    );

const cleanUrl = (value: string) => escapeHtml(value);

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("es-PE", {
        timeZone: "America/Lima",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function whatsappUrl(): string {
    const digits = env.companyWhatsapp.replace(/\D/g, "");
    return digits ? `https://wa.me/${digits}` : env.companyWebsite;
}

function quotationText(input: RequestSubmission, document: RequestDocument): string {
    const { customer } = input;
    const lines = [
        "ISOCAL - Solicitud de cotización recibida",
        "",
        `Hola ${customer.fullName},`,
        "",
        "Recibimos tu solicitud y generamos automáticamente la cotización en PDF.",
        "",
        "Datos registrados",
        `Nombre: ${customer.fullName}`,
        `Correo: ${customer.email}`,
        `Teléfono / WhatsApp: ${customer.phone}`,
        ...(customer.companyName ? [`Empresa: ${customer.companyName}`] : []),
        ...(customer.ruc ? [`RUC: ${customer.ruc}`] : []),
        ...(customer.location ? [`Ubicación: ${customer.location}`] : []),
        "",
        "Equipos o servicios solicitados",
        ...(document.items.length
            ? document.items.map(
                  (item) =>
                      `${item.quantity} × ${item.name}${item.notes ? ` - ${item.notes}` : ""}`,
              )
            : ["Solicitud general, sin productos del catálogo."]),
        ...(customer.notes ? ["", "Detalle adicional", customer.notes] : []),
        "",
        "La cotización en PDF se envía automáticamente al correo indicado. Los campos de precio se mantienen sin completar.",
        "",
        `${env.companyEmail} | WhatsApp ${env.companyWhatsapp} | ${env.companyWebsite}`,
    ];
    return lines.join("\n");
}

function quotationHtml(input: RequestSubmission, document: RequestDocument): string {
    const { customer } = input;
    const details = [
        ["Nombre", customer.fullName],
        ["Correo", customer.email],
        ["Teléfono / WhatsApp", customer.phone],
        ["Empresa", customer.companyName],
        ["RUC", customer.ruc],
        ["Ubicación", customer.location],
    ].filter((item): item is [string, string] => Boolean(item[1]));

    const detailRows = details
        .map(
            ([label, value]) => `
                <tr>
                    <td style="padding:8px 0;color:#6b7a83;font-size:12px;width:145px;vertical-align:top;">${escapeHtml(label)}</td>
                    <td style="padding:8px 0;color:#12232e;font-size:13px;font-weight:600;vertical-align:top;">${escapeHtml(value)}</td>
                </tr>`,
        )
        .join("");

    const items = document.items.length
        ? document.items
              .map(
                  (item) => `
                    <tr>
                        <td style="padding:13px 12px;border-top:1px solid #e8edef;color:#c9152d;font-size:14px;font-weight:700;text-align:center;width:56px;">${item.quantity}</td>
                        <td style="padding:13px 12px;border-top:1px solid #e8edef;color:#12232e;font-size:13px;line-height:1.45;">
                            <strong>${escapeHtml(item.name)}</strong>
                            ${item.notes ? `<div style="margin-top:4px;color:#6b7a83;font-size:12px;">${escapeHtml(item.notes)}</div>` : ""}
                        </td>
                    </tr>`,
              )
              .join("")
        : `<tr><td colspan="2" style="padding:16px;border-top:1px solid #e8edef;color:#6b7a83;font-size:13px;">Solicitud general, sin productos del catálogo.</td></tr>`;

    const additional = customer.notes
        ? `
            <div style="margin-top:22px;padding:16px 18px;background:#fff7f8;border:1px solid #f1d2d7;border-radius:10px;">
                <div style="color:#c9152d;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Detalle adicional</div>
                <div style="margin-top:8px;color:#263943;font-size:13px;line-height:1.6;">${escapeHtml(customer.notes).replace(/\n/g, "<br>")}</div>
            </div>`
        : "";

    const socialLinks = [
        ["Instagram", env.companyInstagram],
        ["Facebook", env.companyFacebook],
        ["YouTube", env.companyYoutube],
        ["LinkedIn", env.companyLinkedin],
        ...(env.companyTiktok ? [["TikTok", env.companyTiktok]] : []),
    ] as [string, string][];

    const socialHtml = socialLinks
        .map(
            ([label, url]) =>
                `<a href="${cleanUrl(url)}" style="color:#dbe2e6;text-decoration:none;margin-right:14px;font-size:11px;">${label}</a>`,
        )
        .join("");

    return `<!doctype html>
<html lang="es">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Solicitud recibida - ISOCAL</title>
</head>
<body style="margin:0;padding:0;background:#eef2f4;font-family:Arial,Helvetica,sans-serif;color:#12232e;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#eef2f4;padding:28px 12px;">
<tr>
<td align="center">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 28px rgba(7,23,32,.08);">
<tr>
<td style="height:6px;background:#c9152d;font-size:0;line-height:0;">&nbsp;</td>
</tr>
<tr>
<td style="padding:26px 34px;background:#071720;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
<tr>
<td style="color:#ffffff;font-size:24px;font-weight:800;letter-spacing:.02em;">ISOCAL</td>
<td align="right" style="color:#aebbc2;font-size:11px;">${escapeHtml(formatDate(document.createdAt))}</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding:34px 34px 8px;">
<div style="color:#c9152d;font-size:11px;font-weight:800;letter-spacing:.10em;text-transform:uppercase;">Solicitud comercial</div>
<h1 style="margin:8px 0 10px;color:#12232e;font-size:27px;line-height:1.18;">Recibimos tu solicitud</h1>
<p style="margin:0;color:#5f7079;font-size:14px;line-height:1.65;">Hola <strong style="color:#12232e;">${escapeHtml(customer.fullName)}</strong>. Gracias por contactar a ISOCAL. La cotización en PDF se genera y se envía automáticamente al correo que indicaste.</p>
</td>
</tr>
<tr>
<td style="padding:18px 34px 8px;">
<div style="padding:20px 22px;background:#f5f7f8;border:1px solid #e6ecef;border-radius:12px;">
<div style="margin-bottom:7px;color:#12232e;font-size:15px;font-weight:700;">Datos registrados</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">${detailRows}</table>
</div>
</td>
</tr>
<tr>
<td style="padding:18px 34px 8px;">
<div style="margin-bottom:10px;color:#12232e;font-size:15px;font-weight:700;">Equipos o servicios solicitados</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #e8edef;border-radius:10px;border-collapse:separate;border-spacing:0;overflow:hidden;">
<tr>
<td style="padding:10px 12px;background:#12232e;color:#ffffff;font-size:10px;font-weight:700;text-align:center;width:56px;">CANT.</td>
<td style="padding:10px 12px;background:#12232e;color:#ffffff;font-size:10px;font-weight:700;">DETALLE</td>
</tr>
${items}
</table>
${additional}
</td>
</tr>
<tr>
<td style="padding:20px 34px 10px;">
<div style="padding:16px 18px;background:#071720;border-radius:11px;color:#dce4e8;font-size:12px;line-height:1.6;">
<strong style="display:block;margin-bottom:4px;color:#ffffff;font-size:13px;">Constancia adjunta en PDF</strong>
El archivo adjunto es la cotización generada automáticamente. Los campos de precio se mantienen sin completar.
</div>
</td>
</tr>
<tr>
<td style="padding:20px 34px 34px;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0">
<tr>
<td style="border-radius:8px;background:#c9152d;">
<a href="${cleanUrl(whatsappUrl())}" style="display:inline-block;padding:12px 18px;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;">Escribir por WhatsApp</a>
</td>
<td style="width:10px;"></td>
<td style="border-radius:8px;border:1px solid #d7dfe3;">
<a href="${cleanUrl(env.companyWebsite)}" style="display:inline-block;padding:11px 18px;color:#12232e;text-decoration:none;font-size:13px;font-weight:700;">Visitar isocal.pe</a>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td style="padding:24px 34px;background:#071720;">
<div style="margin-bottom:8px;color:#ffffff;font-size:12px;font-weight:700;">${escapeHtml(env.companyLegalName)}</div>
<div style="color:#aebbc2;font-size:11px;line-height:1.7;">
<a href="mailto:${escapeHtml(env.companyEmail)}" style="color:#ffffff;text-decoration:none;">${escapeHtml(env.companyEmail)}</a>
&nbsp;·&nbsp; WhatsApp ${escapeHtml(env.companyWhatsapp)}
&nbsp;·&nbsp; ${escapeHtml(env.companyWebsite.replace(/^https?:\/\//, ""))}
</div>
<div style="margin-top:12px;">${socialHtml}</div>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
}

function genericMessage(input: RequestSubmission, document: RequestDocument) {
    const { customer } = input;
    const lines = [
        env.companyLegalName || "ISOCAL",
        `RUC del proveedor: ${env.companyRuc}`,
        `Contacto: ${env.companyEmail}`,
        "",
        `Referencia: ${document.reference}`,
        `Fecha: ${document.createdAt.toLocaleString("es-PE", { timeZone: "America/Lima" })} (Lima, Perú)`,
        `Nombre: ${customer.fullName}`,
        `Correo: ${customer.email}`,
        `Teléfono: ${customer.phone}`,
        `Empresa: ${customer.companyName || "—"}`,
        `RUC: ${customer.ruc || "—"}`,
        `Ubicación: ${customer.location || "—"}`,
        "",
        ...document.items.map(
            (item) => `${item.quantity} × ${item.name}${item.notes ? ` — ${item.notes}` : ""}`,
        ),
        "",
        customer.notes || "",
    ];

    if (input.kind === "complaint" && input.complaint) {
        const details = input.complaint;
        lines.push(
            "",
            `Tipo: ${details.type}`,
            `Documento: ${details.document}`,
            `Domicilio: ${details.address}`,
            `Bien o servicio: ${details.product}`,
            `Monto reclamado (S/): ${details.amount}`,
            `Pedido: ${details.request}`,
            `Representante de menor de edad: ${details.guardian || "No aplica"}`,
        );
    }

    const title = input.kind === "complaint" ? "Hoja de reclamación" : "Consulta a ISOCAL";
    const text = lines.join("\n");
    return {
        text,
        html: `<h1>${title}</h1><pre style="font-family:Arial;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
    };
}

export function requestMessage(input: RequestSubmission, document: RequestDocument) {
    if (input.kind === "quotation") {
        return {
            text: quotationText(input, document),
            html: quotationHtml(input, document),
        };
    }
    return genericMessage(input, document);
}
