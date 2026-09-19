import { AppError } from "../../shared/errors/AppError.js";
import type { LoginInput } from "./auth.types.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fail(message: string, details?: unknown): never {
    throw new AppError(400, message, "VALIDATION_ERROR", details);
}

function asObject(value: unknown): Record<string, unknown> {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        fail("El cuerpo de la solicitud debe ser un objeto JSON.");
    }
    return value as Record<string, unknown>;
}

function assertOnlyFields(body: Record<string, unknown>, allowed: Set<string>): void {
    const unknownFields = Object.keys(body).filter((field) => !allowed.has(field));
    if (unknownFields.length > 0) {
        fail("La solicitud contiene campos no permitidos.", { fields: unknownFields });
    }
}

export function validateLoginBody(value: unknown): asserts value is LoginInput {
    const body = asObject(value);
    assertOnlyFields(body, new Set(["email", "password"]));

    if (typeof body.email !== "string" || !emailPattern.test(body.email.trim())) {
        fail("Debes ingresar un correo electrónico válido.");
    }
    if (
        typeof body.password !== "string" ||
        body.password.length < 8 ||
        body.password.length > 128
    ) {
        fail("La contraseña debe tener entre 8 y 128 caracteres.");
    }
}

export interface CreateAdminAccountInput {
    name: string;
    email: string;
    password: string;
}

export function validateCreateAdminBody(
    value: unknown,
): asserts value is CreateAdminAccountInput {
    const body = asObject(value);
    assertOnlyFields(body, new Set(["name", "email", "password"]));

    if (typeof body.name !== "string" || body.name.trim().length < 2 || body.name.trim().length > 120) {
        fail("El nombre debe tener entre 2 y 120 caracteres.");
    }
    if (typeof body.email !== "string" || !emailPattern.test(body.email.trim())) {
        fail("Debes ingresar un correo electrónico válido.");
    }
    if (
        typeof body.password !== "string" ||
        body.password.length < 12 ||
        body.password.length > 128
    ) {
        fail("La contraseña debe tener entre 12 y 128 caracteres.");
    }
}

export interface UpdateAdminStatusInput {
    isActive: boolean;
}

export function validateAdminStatusBody(
    value: unknown,
): asserts value is UpdateAdminStatusInput {
    const body = asObject(value);
    assertOnlyFields(body, new Set(["isActive"]));
    if (typeof body.isActive !== "boolean") {
        fail("isActive debe ser booleano.");
    }
}
