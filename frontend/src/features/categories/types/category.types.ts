export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type PublicCategory =
    Pick<
        Category,
        | "id"
        | "name"
        | "slug"
        | "description"
    >;

export interface CategoryInput {
    name: string;
    slug: string;
    description: string | null;
}

export type CategoryUpdateInput =
    Partial<CategoryInput> & {
        isActive?: boolean;
    };
