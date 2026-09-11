export interface PublicNavigationItem {
    label: string;
    to: string;
    end?: boolean;
    children?: readonly PublicNavigationChild[];
}

export interface PublicNavigationChild {
    label: string;
    to: string;
    description: string;
}

export const PUBLIC_NAVIGATION_ITEMS:
    readonly PublicNavigationItem[] = [
        {
            label: "Inicio",
            to: "/",
            end: true,
        },
        {
            label: "Nosotros",
            to: "/nosotros",
        },
        {
            label: "Servicios",
            to: "/servicios",
            children: [
                {
                    label: "Metrología",
                    to: "/servicios#metrologia",
                    description:
                        "Calibración, mantenimiento y ensayos.",
                },
                {
                    label: "Consultoría",
                    to: "/servicios#consultoria",
                    description:
                        "Sistemas de gestión, normas ISO y capacitación.",
                },
                {
                    label: "Auditoría",
                    to: "/servicios#auditoria",
                    description:
                        "Diagnóstico y auditorías internas.",
                },
            ],
        },
        {
            label: "Productos",
            to: "/productos",
        },
    ];