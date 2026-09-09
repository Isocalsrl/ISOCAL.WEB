import type { Category } from "./categories.types.js";

export interface CategoryRow {
    id: number,
    name: string,
    slug: string,
    description: string | null,
    is_active: boolean,
    created_at: Date,
    updated_at: Date,
}

export function toCategory(row: CategoryRow): Category {
    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }
}
