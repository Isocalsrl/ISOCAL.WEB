import type { LoginCredentials } from "../types/auth.types";

const EMAIL_PATTERN =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface LoginValidationResult {
    credentials?: LoginCredentials;
    errorMessage?: string;
}

export function validateLogin(
    email: string,
    password: string,
): LoginValidationResult {
    const normalizedEmail =
        email.trim();

    if (!normalizedEmail || !password) {
        return {
            errorMessage:
                "Completa el correo y la contraseña.",
        };
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
        return {
            errorMessage:
                "Ingresa un correo electrónico válido.",
        };
    }

    if (
        password.length < 8 ||
        password.length > 128
    ) {
        return {
            errorMessage:
                "La contraseña debe tener entre 8 y 128 caracteres.",
        };
    }

    return {
        credentials: {
            email: normalizedEmail,
            password,
        },
    };
}
