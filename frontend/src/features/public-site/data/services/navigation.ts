import type { ServiceNavigationItem } from "./types";

export const SERVICE_NAVIGATION:
    readonly ServiceNavigationItem[] = [
        {
            id: "metrologia",
            number: "01",
            title: "Metrología",
            description:
                "Calibración, mantenimiento y ensayos para equipos, instrumentos y ambientes técnicos.",
        },
        {
            id: "consultoria",
            number: "02",
            title: "Consultoría",
            description:
                "Implementación, capacitación y acompañamiento para sistemas de gestión y normas ISO.",
        },
        {
            id: "auditoria",
            number: "03",
            title: "Auditoría",
            description:
                "Evaluaciones de diagnóstico e internas para sistemas de gestión y laboratorios.",
        },
    ];
