export const COMPANY = {
    name: "ISOCAL",
    legalName: "Ingeniería y Soluciones de Calibración E.I.R.L.",
    ruc: "20611996897",
    location: "Lima, Perú",
    slogan: "Mediciones que mejoran decisiones",
    website: "https://www.isocal.pe",
    socialHandle: "@isocal.pe",

    instagram: "https://www.instagram.com/isocal.pe/",
    facebook: "https://www.facebook.com/p/Isocal-61558369539142/",
    youtube: "https://www.youtube.com/@IsocalPeru",
    linkedin: "https://www.linkedin.com/company/isocalperu/",
    tiktok: null,

    primaryPhone: "+51 991 769 896",
    primaryPhoneHref: "tel:+51991769896",

    secondaryPhone: "+51 993 626 527",
    secondaryPhoneHref: "tel:+51993626527",

    whatsappPhone: "+51 991 769 896",
    whatsapp: "https://wa.me/51991769896",

    salesEmail: "ventas@isocal.pe",
    salesEmailHref: "mailto:ventas@isocal.pe",

    metrologyEmail: "metrologia@isocal.pe",
    metrologyEmailHref: "mailto:metrologia@isocal.pe",

    mission:
        "Brindar solución integral a todas las necesidades metrológicas de calibración, equipamiento y capacitación.",

    vision: "Ser el mejor socio experto y confiable del país para las empresas que buscan no solo cumplir con normas ISO y regulaciones estatales, sino para aquellas que siempre van en búsqueda de la excelencia.",
} as const;

export function contactUrl(subject?: string): string {
    const message = subject
        ? `Hola, ISOCAL. Quisiera información sobre ${subject}.`
        : "Hola, ISOCAL. Quisiera orientación sobre sus servicios.";

    return `${COMPANY.whatsapp}?text=${encodeURIComponent(message)}`;
}
