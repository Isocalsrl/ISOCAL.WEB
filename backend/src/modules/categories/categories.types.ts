export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateCategoryInput {
    name: string;
    slug: string;
    description?: string | null;
    isActive?: boolean;
}
export interface UpdateCategoryInput {
    name?: string;
    slug?: string;
    description?: string | null;
    isActive?: boolean;
}
