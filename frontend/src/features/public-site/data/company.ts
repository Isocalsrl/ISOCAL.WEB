export const COMPANY = {
    name: "ISOCAL",
    slogan: "Mediciones que mejoran decisiones",
    website: "https://www.isocal.pe",
    socialHandle: "@isocal.pe",

    primaryPhone: "+51 991 084 825",
    primaryPhoneHref: "tel:+51991084825",

    secondaryPhone: "+51 991 769 896",
    secondaryPhoneHref: "tel:+51991769896",

    whatsapp: "https://wa.me/51991084825",

    salesEmail: "ventas@isocal.pe",
    salesEmailHref: "mailto:ventas@isocal.pe",

    metrologyEmail: "metrologia@isocal.pe",
    metrologyEmailHref: "mailto:metrologia@isocal.pe",

    mission:
        "Brindar solución integral a todas las necesidades metrológicas de calibración, equipamiento y capacitación.",

    vision:
        "Ser el mejor socio experto y confiable del país para las empresas que buscan no solo cumplir con normas ISO y regulaciones estatales, sino para aquellas que siempre van en búsqueda de la excelencia.",
} as const;

export function contactUrl(
    subject?: string,
): string {
    const message = subject
        ? `Hola, ISOCAL. Quisiera información sobre ${subject}.`
        : "Hola, ISOCAL. Quisiera orientación sobre sus servicios.";

    return `${COMPANY.whatsapp}?text=${encodeURIComponent(
        message,
    )}`;
}