export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    categoryId: number | null;
    imageUrl: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type PublicProduct =
    Pick<
        Product,
        | "id"
        | "name"
        | "slug"
        | "description"
        | "categoryId"
        | "imageUrl"
    >;

export interface ProductFieldsInput {
    name: string;
    slug: string;
    description: string | null;
    categoryId: number | null;
}

export interface ProductInput extends ProductFieldsInput {
    image: File;
}

export type ProductUpdateInput = Partial<ProductFieldsInput> & {
        image?: File;
        isActive?: boolean;
    };
