export const HOME_SERVICE_AREAS = [
    {
        id: "metrologia",
        number: "01",
        label: "Metrología",
        title: "Calibración y control metrológico",
        description:
            "Servicios de calibración para instrumentos y equipos, además de mantenimiento y ensayos técnicos.",
        detail: "19 áreas técnicas en el portafolio",
        image: "/images/company/met.webp",
    },
    {
        id: "consultoria",
        number: "02",
        label: "Consultoría y capacitación",
        title: "Sistemas de gestión y formación técnica",
        description:
            "Acompañamiento para implementar, fortalecer y comprender normas aplicables a laboratorios y organizaciones.",
        detail: "ISO/IEC 17025 · ISO/IEC 17020 · ISO 9001",
        image: "/images/company/consult.webp",
    },
    {
        id: "auditoria",
        number: "03",
        label: "Auditoría",
        title: "Auditorías de diagnóstico e internas",
        description:
            "Auditorías de diagnóstico e internas para revisar brechas y cumplimiento del sistema de gestión.",
        detail: "Diagnóstico · Auditoría interna",
        image: "/images/company/audit.webp",
    },
] as const;

export const HOME_CAPABILITY_IDS = [
    "temperatura",
    "presion",
    "electricidad",
    "masa",
    "longitud-angulo",
    "fotometria-acustica",
] as const;

export const HOME_ASSURANCE_ITEMS = [
    {
        number: "01",
        eyebrow: "Red metrológica",
        title: "Laboratorios acreditados en la red metrológica",
        detail: "INACAL · A2LA · PJLA",
    },
    {
        number: "02",
        eyebrow: "Metrología",
        title: "Calibraciones bajo el marco ISO/IEC 17025",
        detail: "Magnitudes e instrumentos del portafolio técnico",
    },
    {
        number: "03",
        eyebrow: "Consultoría",
        title: "Consultoría y capacitación en sistemas de gestión",
        detail: "ISO/IEC 17025 · ISO/IEC 17020 · ISO 9001",
    },
    {
        number: "04",
        eyebrow: "Auditoría",
        title: "Diagnóstico e auditoría interna para sistemas de gestión",
        detail: "ISO 9001 · ISO 14001 · ISO 45001 · ISO 15189",
    },
] as const;
