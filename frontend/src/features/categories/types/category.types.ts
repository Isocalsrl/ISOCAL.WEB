export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryInput {
    name: string;
    slug: string;
    description: string | null;
}

export type CategoryUpdateInput =
    Partial<CategoryInput> & {
        isActive?: boolean;
    };
