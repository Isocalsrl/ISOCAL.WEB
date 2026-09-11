export interface ServiceNavigationItem {
    id: string;
    number: string;
    title: string;
    description: string;
}

export interface ServiceGroup {
    id: string;
    title: string;
    items: readonly string[];
}
