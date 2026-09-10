export interface PublicNavigationItem {
    label: string;
    to: string;
    end?: boolean;
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
        },
        {
            label: "Productos",
            to: "/productos",
        },
    ];
