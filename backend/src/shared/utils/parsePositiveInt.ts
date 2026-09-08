import { AppError } from "../errors/AppError.js";

export function parsePositiveInt(
    value: unknown,
    fieldName = "id",
): number {
    const parsed = typeof value === "number"
        ? value
        : typeof value === "string" && value.trim() !== ""
            ? Number(value)
            : Number.NaN;

    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new AppError(
            400,
            `${fieldName} debe ser un entero positivo.`,
            "INVALID_ID",
        );
    }

    return parsed;
}
