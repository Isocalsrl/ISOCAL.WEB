import { AppError } from "../../../shared/errors/AppError.js";
import * as productsRepository from "../repositories/index.js";

export async function validateCategory(
    categoryId: number | null | undefined,
): Promise<void> {
    if (categoryId == null) {
        return;
    }

    const exists = await productsRepository.categoryExists(categoryId);

    if (!exists) {
        throw new AppError(
            400,
            "La categoría indicada no existe o está inactiva.",
            "INVALID_CATEGORY",
        );
    }
}
