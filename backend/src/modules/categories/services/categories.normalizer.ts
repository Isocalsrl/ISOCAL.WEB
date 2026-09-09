import type {
    CreateCategoryInput,
    UpdateCategoryInput,
} from "../categories.types.js"

export function normalizeCreateInput(
    input: CreateCategoryInput
): CreateCategoryInput  {
    return {
        ...input,

        name: input.name.trim(),

        slug: input.slug
            .trim()
            .toLowerCase(),

        description: input.description?.trim() || null,
    };
}

export function normalizeUpdateInput(
    input: UpdateCategoryInput
): UpdateCategoryInput {
    const normalized: UpdateCategoryInput = {};

    if (input.name !== undefined) {
        normalized.name =
            input.name.trim();
    }

    if (input.slug !== undefined) {
        normalized.slug =
            input.slug
                .trim()
                .toLowerCase();
    }

    if (input.description !== undefined) {
        normalized.description =
            input.description?.trim() || null;
    }

    if (input.isActive !== undefined) {
        normalized.isActive =
            input.isActive;
    }

    return normalized;
}
