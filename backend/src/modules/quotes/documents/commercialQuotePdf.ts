import { existsSync } from "node:fs";
import { join } from "node:path";
import PDFDocument from "pdfkit";
import { env } from "../../../config/env.js";
import type { QuoteDetail } from "../quotes.types.js";

const PAGE = { width: 595.28, height: 841.89, headerHeight: 95, footerHeight: 57 };
const COLORS = { gray: "#8c8c8c", dark: "#50515b", blue: "#17479e", lightBlue: "#d6e2f3", green: "#00b050", border: "#222222" };
const assets = join(__dirname, "assets");

export type CommercialQuotePdfItem = QuoteDetail["items"][number] & {
    image?: Buffer | null;
};

export type CommercialQuotePdfInput = Omit<QuoteDetail, "items"> & {
    items: CommercialQuotePdfItem[];
};

function asset(name: string): string {
    const path = join(assets, name);
    if (!existsSync(path)) throw new Error(`No se encontró el asset PDF ${name}.`);
    return path;
}

function money(value: number): string {
    return value.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function currency(value: number | null, spacing = "  "): string {
    return value === null ? "" : `S/${spacing}${money(value)}`;
}

function dateEs(value: Date): string {
    return new Intl.DateTimeFormat("es-PE", {
        timeZone: "America/Lima",
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(value);
}

function addChrome(pdf: PDFKit.PDFDocument, watermark = true): void {
    pdf.image(asset("isocal_header.png"), 0, 0, { width: PAGE.width, height: PAGE.headerHeight });
    pdf.image(asset("isocal_footer.png"), 0, PAGE.height - PAGE.footerHeight, {
        width: PAGE.width,
        height: PAGE.footerHeight,
    });
    if (watermark) {
        pdf.image(asset("isocal_watermark_exact_20pct.png"), 72, 392, { width: 455 });
    }
}

function labelValue(pdf: PDFKit.PDFDocument, label: string, value: string, y: number): void {
    pdf.font("Helvetica-Bold").fontSize(9.2).fillColor("#111").text(label, 85, y, { width: 105 });
    pdf.font("Helvetica-Bold").text(":", 190, y, { width: 10 });
    pdf.font("Helvetica").text(value || "-", 226, y, { width: 310 });
}

function drawCustomer(pdf: PDFKit.PDFDocument, input: CommercialQuotePdfInput): number {
    let y = 124;
    pdf.font("Helvetica-Bold").fontSize(17).fillColor("#000").text("Cotización", 360, y - 18, { width: 190, align: "right" });
    pdf.font("Helvetica").fontSize(9.2).text(`Lima, ${dateEs(input.createdAt)}`, 85, y + 6, { width: 260 });
    y += 36;
    labelValue(pdf, "EMPRESA", input.companyName ?? input.customerName, y); y += 15;
    labelValue(pdf, "RUC", input.ruc ?? "-", y); y += 15;
    labelValue(pdf, "DIRECCIÓN", input.location ?? "-", y); y += 15;
    labelValue(pdf, "CONTACTO", input.customerName, y); y += 15;
    labelValue(pdf, "CELULAR", input.customerPhone, y); y += 27;
    pdf.font("Helvetica-Bold").fontSize(9.2).text("Estimados Señores:", 85, y);
    y += 15;
    pdf.font("Helvetica").fontSize(9.2).text(
        "Nuestro cordial saludo, asimismo de acuerdo a su solicitud; le hacemos llegar nuestra propuesta económica:",
        85, y, { width: 450, lineGap: 2 },
    );
    return y + 39;
}

function drawTableHeader(pdf: PDFKit.PDFDocument, top: number, widths: number[]): void {
    const left = 21;
    const labels = ["ÍTEM", "DESCRIPCIÓN DEL PRODUCTO", "UNID", "COSTO\nUNITARIO", "COSTO\nTOTAL"];
    let x = left;
    for (let i = 0; i < widths.length; i += 1) {
        pdf.rect(x, top, widths[i], 42).fillAndStroke(COLORS.gray, COLORS.border);
        pdf.font("Helvetica-Bold").fontSize(i === 1 ? 8.4 : 7.9).fillColor("#fff").text(labels[i], x + 3, top + (i >= 3 ? 8 : 15), {
            width: widths[i] - 6,
            align: "center",
            lineGap: 1,
        });
        x += widths[i];
    }
}

function fitProductImage(pdf: PDFKit.PDFDocument, image: Buffer, x: number, y: number, width: number, height: number): void {
    try {
        pdf.image(image, x, y, { fit: [width, height], align: "center", valign: "center" });
    } catch {
        // El PDF sigue siendo válido aunque una imagen cargada por el usuario esté corrupta.
    }
}

function drawItemRow(
    pdf: PDFKit.PDFDocument,
    input: CommercialQuotePdfInput,
    item: CommercialQuotePdfItem,
    index: number,
    top: number,
    height: number,
    widths: number[],
): void {
    const left = 21;
    let x = left;
    for (const width of widths) {
        pdf.rect(x, top, width, height).strokeColor(COLORS.border).lineWidth(0.55).stroke();
        x += width;
    }

    pdf.font("Helvetica").fontSize(8.5).fillColor("#111").text(String(index + 1), left + 2, top + height / 2 - 5, { width: widths[0] - 4, align: "center" });

    const descX = left + widths[0] + 6;
    const descW = widths[1] - 12;
    pdf.font("Helvetica-Bold").fontSize(9.1).text(item.productName.toUpperCase(), descX, top + 7, { width: descW });
    const titleHeight = pdf.heightOfString(item.productName.toUpperCase(), { width: descW });
    const imageSize = Math.min(178, Math.max(118, height * 0.48));
    const imageX = descX + descW - imageSize - 3;
    const imageY = top + Math.max(44, titleHeight + 16);
    const textWidth = item.image ? Math.max(118, descW - imageSize - 14) : descW;

    if (item.productDescription) {
        pdf.font("Helvetica").fontSize(8.15).fillColor("#111").text(item.productDescription, descX, top + 10 + titleHeight, {
            width: textWidth,
            lineGap: 1.3,
            height: height - 38,
            ellipsis: true,
        });
    }
    if (item.image) fitProductImage(pdf, item.image, imageX, imageY, imageSize, Math.min(imageSize, height - (imageY - top) - 16));

    if (item.customerNotes) {
        const notesY = top + height - 67;
        pdf.font("Helvetica-Bold").fontSize(8.2).text("DETALLE DEL REQUERIMIENTO:", descX, notesY, { width: descW });
        pdf.font("Helvetica").fontSize(7.9).text(item.customerNotes, descX, notesY + 12, { width: descW, height: 45, ellipsis: true });
    }

    const qtyX = left + widths[0] + widths[1];
    const unitX = qtyX + widths[2];
    const totalX = unitX + widths[3];
    const centerY = top + height / 2 - 5;
    pdf.font("Helvetica").fontSize(8.6).text(String(item.quantity), qtyX, centerY, { width: widths[2], align: "center" });
    pdf.text(currency(item.unitPrice), unitX + 4, centerY, { width: widths[3] - 8, align: "right" });
    pdf.text(currency(item.subtotal), totalX + 4, centerY, { width: widths[4] - 8, align: "right" });
}

function drawTotals(pdf: PDFKit.PDFDocument, input: CommercialQuotePdfInput, top: number, widths: number[]): void {
    const left = 21;
    const labelWidth = widths[0] + widths[1] + widths[2] + widths[3];
    const valueX = left + labelWidth;
    const rows: Array<[string, number | null]> = [
        ["SUB TOTAL", input.subtotal],
        [`IGV ${input.taxRate}%`, input.taxAmount],
        ["TOTAL", input.total],
    ];
    rows.forEach(([label, value], index) => {
        const y = top + index * 22;
        pdf.rect(left, y, labelWidth, 22).strokeColor(COLORS.border).lineWidth(0.55).stroke();
        pdf.rect(valueX, y, widths[4], 22).fillAndStroke(COLORS.gray, COLORS.border);
        pdf.font("Helvetica-Bold").fontSize(8.4).fillColor("#111").text(label, left, y + 7, { width: labelWidth - 8, align: "right" });
        pdf.fillColor("#fff").text(currency(value, "    "), valueX + 4, y + 7, { width: widths[4] - 8, align: "right" });
    });
}

function drawCommercialConditions(pdf: PDFKit.PDFDocument, input: CommercialQuotePdfInput): void {
    addChrome(pdf);
    let y = 122;
    pdf.font("Helvetica-Bold").fontSize(10).fillColor("#111").text("Condiciones Comerciales:", 85, y, { underline: true });
    y += 17;
    const valid = input.validUntil
        ? `${Math.max(1, Math.ceil((new Date(`${input.validUntil}T00:00:00`).getTime() - input.createdAt.getTime()) / 86400000))} días calendario`
        : `${env.quotationValidityDays} días calendario`;
    const lines: Array<[string, string]> = [
        ["Validez de Cotización", valid],
        ["Forma de Pago", input.paymentTerms ?? env.quotationPaymentTerms],
        ["Tiempo del Servicio", env.quotationServiceTime],
        ["Entregables", env.quotationDeliverables],
        ["Laboratorio Encargado", env.quotationLaboratory],
        ["Dirección Laboratorio", `${env.companyLabAddress1}\n${env.companyLabAddress2}`],
    ];
    for (const [label, value] of lines) {
        pdf.font("Helvetica-Bold").fontSize(9.2).text(label, 85, y, { width: 140 });
        pdf.font("Helvetica-Bold").text(":", 225, y, { width: 8 });
        pdf.font("Helvetica").text(value, 233, y, { width: 315, lineGap: 2 });
        const valueHeight = pdf.heightOfString(value, { width: 315, lineGap: 2 });
        y += Math.max(23, valueHeight + 7);
    }
    pdf.font("Helvetica-Bold").text("•   Emitir el abono a la cuenta bancaria:", 85, y + 2);
    y += 28;

    const boxX = 97;
    const boxW = 402;
    pdf.rect(boxX, y, boxW, 17).fillAndStroke(COLORS.blue, "#008ca8");
    pdf.font("Helvetica-Bold").fontSize(9).fillColor("#fff").text("NÚMERO DE CUENTAS BANCARIAS", boxX, y + 4, { width: boxW, align: "center" });
    y += 17;
    pdf.rect(boxX, y, boxW, 31).strokeColor("#008ca8").stroke();
    pdf.font("Helvetica").fontSize(8.7).fillColor("#111").text(`Cuenta Corriente: ${env.paymentAccountHolder}`, boxX + 5, y + 4, { width: boxW - 10, align: "center" });
    pdf.text(`Yape: ${env.paymentAccountHolder}`, boxX + 5, y + 16, { width: boxW - 10, align: "center" });
    y += 31;
    pdf.rect(boxX, y, boxW, 17).fillAndStroke(COLORS.lightBlue, "#008ca8");
    pdf.font("Helvetica-Bold").fontSize(9).text("BANCO BCP", boxX, y + 4, { width: boxW, align: "center" });
    y += 17;
    const bankH = 169;
    pdf.rect(boxX, y, boxW, bankH).strokeColor("#008ca8").stroke();
    pdf.image(asset("isocal_watermark_exact_20pct.png"), boxX - 22, y + 31, { width: boxW + 35 });
    const dataY = y + 25;
    const bankRows: Array<[string, string]> = [
        ["CTA. SOLES:", env.paymentBcpAccountPen],
        ["CCI. SOLES:", env.paymentBcpCciPen],
        ["CTA DETRACCION:", env.paymentBcpDetractionAccount],
        ["YAPE:", env.paymentYapeNumber],
    ];
    bankRows.forEach(([label, value], index) => {
        const ry = dataY + index * 31;
        pdf.font("Helvetica").fontSize(8.7).fillColor("#111").text(label, boxX + 6, ry, { width: 115 });
        pdf.text(value, boxX + 126, ry, { width: 135 });
    });
    pdf.image(asset("bcp_logo_transparent.png"), boxX + 293, y + 18, { fit: [52, 52] });
    pdf.image(asset("yape_qr.png"), boxX + 282, y + 76, { fit: [78, 88] });
    y += bankH + 27;
    pdf.font("Helvetica").fontSize(8.8).fillColor("#111").text(
        "*El servicio estará afecto a una detracción del IGV de 12% si el costo total supera los S/ 700.00 o su equivalente en dólares.",
        85, y, { width: 440, lineGap: 3 },
    );
    // Intencionalmente no se dibuja bloque de firma/comercial.
}

function drawObservations(pdf: PDFKit.PDFDocument, input: CommercialQuotePdfInput): void {
    addChrome(pdf);
    let y = 136;
    pdf.font("Helvetica-Bold").fontSize(10).fillColor("#111").text("OBSERVACIONES", 180, y, { width: 240, align: "center", underline: true });
    y += 31;
    const paragraphs = [
        "Cualquier modificación a la presente pro forma debe ser informada antes de iniciar el servicio; si altera la presente cotización requiere la confirmación expresa de ISOCAL. Si fuera necesario se elaborará una nueva cotización.",
        `- El servicio de reparación no incluye cambio de repuestos y/o suministros, previa cotización.\n- El servicio de calibración se realiza en cumplimiento de todos los requisitos técnicos de la norma NTPISO/IEC17025, en el marco de la libre competencia.\n- Nuestros instrumentos patrones cuentan con trazabilidad de INACAL-DM o de Instituciones reconocidas a nivel Internacional.\n- La coordinación del servicio se realizará con el área de Operaciones mediante los correos: ${env.companyEmail} y ${env.companyOperationsEmail} (${env.companyOperationsPhone}).`,
        "La programación para la atención y fecha de compromiso de entrega de cada servicio está en función de:",
        "a.  La fecha de recepción de la orden de compra u orden de servicio.\nb.  La fecha en que se reciben los objetos a calibrar en nuestras instalaciones.\nc.  La fecha en que se programe la atención del servicio cuando este deba ser en las instalaciones del solicitante, previa coordinación.\nd.  La disponibilidad de nuestros patrones, equipos y personal. Los certificados de calibración son emitidos en formato virtual y entregados a la persona de contacto.",
    ];
    for (const paragraph of paragraphs) {
        pdf.font("Helvetica").fontSize(9.3).fillColor("#111").text(paragraph, 85, y, { width: 430, lineGap: 4 });
        y = pdf.y + 15;
    }
    if (input.commercialNotes) {
        pdf.font("Helvetica-Bold").fontSize(9.2).text("Notas comerciales:", 85, y);
        pdf.font("Helvetica").text(input.commercialNotes, 85, y + 14, { width: 430, lineGap: 3 });
    }
}

export function createCommercialQuotePdf(input: CommercialQuotePdfInput): Promise<Buffer> {
    const items: CommercialQuotePdfItem[] = input.items.length
        ? input.items
        : [{
              id: 0,
              productId: 0,
              productName: "REQUERIMIENTO GENERAL",
              productDescription: input.customerNotes ?? "Solicitud de cotización sin productos seleccionados del catálogo.",
              quantity: 1,
              customerNotes: null,
              unitPrice: null,
              discountAmount: 0,
              subtotal: null,
              imageStorageKey: null,
              image: null,
          }];

    return new Promise((resolve, reject) => {
        const pdf = new PDFDocument({ size: "A4", margin: 0, bufferPages: true, info: { Title: "Cotización ISOCAL", Author: "ISOCAL", CreationDate: new Date() } });
        const chunks: Buffer[] = [];
        pdf.on("data", (chunk) => chunks.push(chunk));
        pdf.on("end", () => resolve(Buffer.concat(chunks)));
        pdf.on("error", reject);

        addChrome(pdf);
        const tableTop = drawCustomer(pdf, input);
        const widths = [42, 319, 29, 78, 85];
        drawTableHeader(pdf, tableTop, widths);
        const available = 728 - (tableTop + 42) - 66;
        const rowHeight = Math.max(112, available / items.length);
        let top = tableTop + 42;
        items.forEach((item, index) => {
            drawItemRow(pdf, input, item, index, top, rowHeight, widths);
            top += rowHeight;
        });
        drawTotals(pdf, input, top, widths);

        pdf.addPage();
        drawCommercialConditions(pdf, input);
        pdf.addPage();
        drawObservations(pdf, input);
        pdf.end();
    });
}
