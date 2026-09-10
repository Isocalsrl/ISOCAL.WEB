export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    categoryId: number | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface ProductInput {
    name: string;
    slug: string;
    description: string | null;
    categoryId: number | null;
}

export type ProductUpdateInput =
    Partial<ProductInput> & {
        isActive?: boolean;
    };
