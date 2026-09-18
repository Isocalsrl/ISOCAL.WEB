import type { Product } from "./products.types.js";
export interface ProductRow {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    category_id: number | null;
    image_version?: number | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}
export function toProduct(row: ProductRow): Product {
    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        categoryId: row.category_id,
        imageUrl: row.image_version !== null && row.image_version !== undefined
            ? `/api/products/${row.id}/image?v=${row.image_version}`
            : null,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
