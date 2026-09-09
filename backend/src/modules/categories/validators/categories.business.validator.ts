import { AppError } from "../../../shared/errors/AppError.js";

import * as categoriesRepository from "../repositories/index.js";

export async function validateCategoryCanBeDeactivated(
    categoryId: number,
): Promise<void> {
    const hasProducts =
        await categoriesRepository
            .hasAssociatedProducts(categoryId);

    if (hasProducts) {
        throw new AppError(
            409,
            "No se puede desactivar una categoría que tiene productos asociados.",
            "CATEGORY_HAS_PRODUCTS",
        );
    }
}
