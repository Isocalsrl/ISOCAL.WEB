import { AppError } from "../../../shared/errors/AppError.js";
import type { AdminRole } from "../../auth/auth.types.js";
import type {
    CreateProductInput,
    Product,
    UpdateProductInput,
} from "../products.types.js";

export function assertCanSetProductState(
    input: CreateProductInput | UpdateProductInput,
    role: AdminRole,
): void {
    if (input.isActive !== undefined && role !== "super_admin") {
        throw new AppError(
            403,
            "Solo un superadministrador puede cambiar el estado de un producto.",
            "FORBIDDEN",
        );
    }
}

export function assertCanModifyProduct(
    product: Product,
    role: AdminRole,
): void {
    if (!product.isActive && role !== "super_admin") {
        throw new AppError(
            403,
            "Solo un superadministrador puede modificar un producto inactivo.",
            "FORBIDDEN",
        );
    }
}
