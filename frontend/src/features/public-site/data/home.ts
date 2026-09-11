export interface HomeServicePreview {
    id: string;
    number: string;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
}

export interface HomeIndustry {
    number: string;
    title: string;
    description: string;
}

export const HOME_SERVICE_PREVIEWS:
    readonly HomeServicePreview[] = [
        {
            id: "metrologia",
            number: "01",
            title: "Metrología",
            description:
                "Calibración respaldada bajo el estándar ISO 17025, además de mantenimiento y ensayos para equipos y ambientes técnicos.",
            image:
                "/images/services/metrologia.webp",
            imageAlt:
                "Especialista trabajando con instrumentos de medición en un laboratorio",
        },
        {
            id: "consultoria",
            number: "02",
            title: "Consultoría",
            description:
                "Implementación, capacitación y acompañamiento para sistemas de gestión y certificaciones ISO aplicables a cada organización.",
            image:
                "/images/services/consultoria.webp",
            imageAlt:
                "Profesional revisando documentación técnica durante una consultoría",
        },
        {
            id: "auditoria",
            number: "03",
            title: "Auditoría",
            description:
                "Evaluaciones técnicas y de gestión orientadas a identificar oportunidades de mejora y fortalecer el cumplimiento.",
            image:
                "/images/services/auditoria.webp",
            imageAlt:
                "Equipo profesional revisando información durante una auditoría",
        },
    ];

export const HOME_INDUSTRIES:
    readonly HomeIndustry[] = [
        {
            number: "01",
            title: "Minería",
            description:
                "Soporte metrológico para operaciones que necesitan mediciones confiables y control técnico.",
        },
        {
            number: "02",
            title: "Manufactura",
            description:
                "Servicios orientados al control de procesos, equipos de medición y requisitos de gestión.",
        },
        {
            number: "03",
            title: "Laboratorios",
            description:
                "Calibración, consultoría, auditoría y capacitación para entornos técnicos y de ensayo.",
        },
    ];