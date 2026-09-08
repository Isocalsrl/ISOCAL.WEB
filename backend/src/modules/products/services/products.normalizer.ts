import type {
    CreateProductInput,
    UpdateProductInput,
} from "../products.types.js";

export function normalizeCreateInput(
    input: CreateProductInput,
): CreateProductInput {
    return {
        ...input,
        name: input.name.trim(),
        slug: input.slug.trim().toLowerCase(),
        description: input.description?.trim() || null,
    };
}

export function normalizeUpdateInput(
    input: UpdateProductInput,
): UpdateProductInput {
    const normalized: UpdateProductInput = {};

    if (input.name !== undefined) {
        normalized.name = input.name.trim();
    }

    if (input.slug !== undefined) {
        normalized.slug = input.slug.trim().toLowerCase();
    }

    if (input.description !== undefined) {
        normalized.description = input.description?.trim() || null;
    }

    if (input.categoryId !== undefined) {
        normalized.categoryId = input.categoryId;
    }

    if (input.isActive !== undefined) {
        normalized.isActive = input.isActive;
    }

    return normalized;
}
