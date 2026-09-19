import { AppError } from "../../shared/errors/AppError.js";
import type { AdminRole } from "../../shared/auth/adminRole.js";
import { getActiveProductsByCategory } from "../products/products.service.js";
import * as repository from "./categories.repository.js";
import type {
    Category,
    CreateCategoryInput,
    UpdateCategoryInput,
} from "./categories.types.js";

function notFound(): AppError {
    return new AppError(404, "Categoría no encontrada.", "CATEGORY_NOT_FOUND");
}

function normalizeCreate(input: CreateCategoryInput): CreateCategoryInput {
    return {
        ...input,
        name: input.name.trim(),
        slug: input.slug.trim().toLowerCase(),
        description: input.description?.trim() || null,
    };
}

function normalizeUpdate(input: UpdateCategoryInput): UpdateCategoryInput {
    return {
        ...(input.name !== undefined && { name: input.name.trim() }),
        ...(input.slug !== undefined && { slug: input.slug.trim().toLowerCase() }),
        ...(input.description !== undefined && {
            description: input.description?.trim() || null,
        }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
    };
}

function assertCanSetState(input: { isActive?: boolean }, role: AdminRole): void {
    if (input.isActive !== undefined && role !== "super_admin") {
        throw new AppError(
            403,
            "Solo un superadministrador puede cambiar el estado de una categoría.",
            "FORBIDDEN",
        );
    }
}

function assertCanModifyInactive(isActive: boolean, role: AdminRole): void {
    if (!isActive && role !== "super_admin") {
        throw new AppError(
            403,
            "Solo un superadministrador puede modificar una categoría inactiva.",
            "FORBIDDEN",
        );
    }
}

async function assertCanDeactivate(id: number): Promise<void> {
    if (await repository.hasProducts(id)) {
        throw new AppError(
            409,
            "No se puede desactivar una categoría que todavía tiene productos asociados.",
            "CATEGORY_HAS_PRODUCTS",
        );
    }
}

export function getCategories(): Promise<Category[]> {
    return repository.findAll(true);
}

export function getAdminCategories(role: AdminRole): Promise<Category[]> {
    return repository.findAll(role !== "super_admin");
}

export async function getCategoryById(id: number): Promise<Category> {
    const category = await repository.findById(id, true);
    if (!category) throw notFound();
    return category;
}

export async function getAdminCategoryById(
    id: number,
    role: AdminRole,
): Promise<Category> {
    const category = await repository.findById(id);
    if (!category || (!category.isActive && role !== "super_admin")) {
        throw notFound();
    }
    return category;
}

export async function getCategoryProducts(id: number) {
    const category = await repository.findById(id, true);
    if (!category) throw notFound();
    return getActiveProductsByCategory(id);
}

export function createCategory(
    input: CreateCategoryInput,
    role: AdminRole,
): Promise<Category> {
    assertCanSetState(input, role);
    return repository.create(normalizeCreate(input));
}

export async function updateCategory(
    id: number,
    input: UpdateCategoryInput,
    role: AdminRole,
): Promise<Category> {
    const existing = await repository.findById(id);
    if (!existing) throw notFound();

    assertCanModifyInactive(existing.isActive, role);
    assertCanSetState(input, role);

    const normalized = normalizeUpdate(input);
    if (existing.isActive && normalized.isActive === false) {
        await assertCanDeactivate(id);
    }

    const category = await repository.update(id, normalized);
    if (!category) throw notFound();
    return category;
}

export async function deactivateCategory(id: number): Promise<Category> {
    const existing = await repository.findById(id);
    if (!existing || !existing.isActive) throw notFound();

    await assertCanDeactivate(id);

    const category = await repository.deactivate(id);
    if (!category) throw notFound();
    return category;
}
