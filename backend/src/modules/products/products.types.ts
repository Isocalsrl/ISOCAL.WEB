export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    categoryId: number | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProductInput {
    name: string;
    slug: string;
    description?: string | null;
    categoryId?: number | null;
    isActive?: boolean;
}

export interface UpdateProductInput {
    name?: string;
    slug?: string;
    description?: string | null;
    categoryId?: number | null;
    isActive?: boolean;
}