import { AppError } from "../../../shared/errors/AppError.js";

import type {
    Product,
} from "../../products/products.types.js";

import type {
    AdminRole,
} from "../../auth/auth.types.js";

import * as categoriesRepository from "../repositories/index.js";

import type {
    Category,
    CreateCategoryInput,
    UpdateCategoryInput,
} from "../categories.types.js";

import {
    normalizeCreateInput,
    normalizeUpdateInput,
} from "./categories.normalizer.js";

import {
    validateCategoryCanBeDeactivated,
} from "../validators/categories.business.validator.js";

function categoryNotFound(): AppError {
    return new AppError(
        404,
        "Categoría no encontrada.",
        "CATEGORY_NOT_FOUND",
    );
}

export async function getCategories(): Promise<Category[]> {
    return categoriesRepository.findAllActive();
}

export async function getAdminCategories(
    role: AdminRole,
): Promise<Category[]> {
    return role === "super_admin"
        ? categoriesRepository.findAll()
        : categoriesRepository.findAllActive();
}

export async function getCategoryById(
    id: number,
): Promise<Category> {
    const category =
        await categoriesRepository
            .findActiveById(id);

    if (!category) {
        throw categoryNotFound();
    }

    return category;
}

export async function getAdminCategoryById(
    id: number,
    role: AdminRole,
): Promise<Category> {
    const category =
        await categoriesRepository
            .findById(id);

    if (
        !category ||
        (!category.isActive &&
            role !== "super_admin")
    ) {
        throw categoryNotFound();
    }

    return category;
}


export async function getCategoryProducts(
    id: number,
): Promise<Product[]> {
    const category =
        await categoriesRepository
            .findActiveById(id);

    if (!category) {
        throw categoryNotFound();
    }

    return categoriesRepository
        .findActiveProductsByCategoryId(id);
}

export async function createCategory(
    input: CreateCategoryInput,
    role: AdminRole,
): Promise<Category> {
    if (
        input.isActive !== undefined &&
        role !== "super_admin"
    ) {
        throw new AppError(
            403,
            "Solo un superadministrador puede definir el estado de una categoría.",
            "FORBIDDEN",
        );
    }

    const normalizedInput =
        normalizeCreateInput(input);

    return categoriesRepository
        .create(normalizedInput);
}

export async function updateCategory(
    id: number,
    input: UpdateCategoryInput,
    role: AdminRole,
): Promise<Category> {
    const existingCategory =
        await categoriesRepository
            .findById(id);

    if (!existingCategory) {
        throw categoryNotFound();
    }

    if (
        !existingCategory.isActive &&
        role !== "super_admin"
    ) {
        throw new AppError(
            403,
            "Solo un superadministrador puede modificar una categoría inactiva.",
            "FORBIDDEN",
        );
    }

    if (
        input.isActive !== undefined &&
        role !== "super_admin"
    ) {
        throw new AppError(
            403,
            "Solo un superadministrador puede cambiar el estado de una categoría.",
            "FORBIDDEN",
        );
    }

    const normalizedInput =
        normalizeUpdateInput(input);

    if (
        existingCategory.isActive &&
        normalizedInput.isActive === false
    ) {
        await validateCategoryCanBeDeactivated(
            id,
        );
    }

    const updatedCategory =
        await categoriesRepository.update(
            id,
            normalizedInput,
        );

    if (!updatedCategory) {
        throw categoryNotFound();
    }

    return updatedCategory;
}

export async function deactivateCategory(
    id: number,
): Promise<Category> {
    const existingCategory =
        await categoriesRepository
            .findById(id);

    if (
        !existingCategory ||
        !existingCategory.isActive
    ) {
        throw categoryNotFound();
    }

    await validateCategoryCanBeDeactivated(
        id,
    );

    const category =
        await categoriesRepository
            .deactivate(id);

    if (!category) {
        throw categoryNotFound();
    }

    return category;
}
