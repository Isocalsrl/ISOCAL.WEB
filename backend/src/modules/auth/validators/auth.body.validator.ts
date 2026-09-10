import {
    AppError,
} from "../../../shared/errors/AppError.js";
import type {
    LoginInput,
} from "../auth.types.js";

const LOGIN_FIELDS =
    new Set([
        "email",
        "password",
    ]);

const EMAIL_PATTERN =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validationError(
    message: string,
    details?: unknown,
): never {
    throw new AppError(
        400,
        message,
        "VALIDATION_ERROR",
        details,
    );
}

function isPlainObject(
    value: unknown,
): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
}

export function validateLoginBody(
    value: unknown,
): asserts value is LoginInput {
    if (!isPlainObject(value)) {
        validationError(
            "El cuerpo de la solicitud debe ser un objeto JSON.",
        );
    }

    const unknownFields =
        Object.keys(value).filter(
            (field) =>
                !LOGIN_FIELDS.has(field),
        );

    if (unknownFields.length > 0) {
        validationError(
            "La solicitud contiene campos no permitidos.",
            {
                fields: unknownFields,
            },
        );
    }

    if (
        typeof value.email !== "string" ||
        !EMAIL_PATTERN.test(
            value.email.trim(),
        )
    ) {
        validationError(
            "Debes ingresar un correo electrónico válido.",
        );
    }

    if (
        typeof value.password !== "string" ||
        value.password.length < 8 ||
        value.password.length > 128
    ) {
        validationError(
            "La contraseña debe tener entre 8 y 128 caracteres.",
        );
    }
}
