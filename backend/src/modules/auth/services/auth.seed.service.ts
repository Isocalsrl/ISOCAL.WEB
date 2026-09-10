import {
    AppError,
} from "../../../shared/errors/AppError.js";
import type {
    AdminRole,
} from "../auth.types.js";
import {
    createAdminIfMissing,
} from "../repositories/auth.create.repository.js";
import {
    hashPassword,
} from "./auth.service.js";

export type SeedAdminResult =
    | "created"
    | "already-exists";

export interface SeedAdminInput {
    name: string;
    email: string;
    password: string;
    role: string;
}

function parseRole(value: string): AdminRole {
    if (
        value === "admin" ||
        value === "super_admin"
    ) {
        return value;
    }

    throw new AppError(
        500,
        "El rol del seed debe ser admin o super_admin.",
        "INVALID_SEED_CONFIGURATION",
    );
}

export async function seedAdmin(
    input: SeedAdminInput,
): Promise<SeedAdminResult> {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();
    const password = input.password;

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new AppError(
            500,
            "Los datos del seed de administrador no son válidos.",
            "INVALID_SEED_CONFIGURATION",
        );
    }

    if (password.length < 8 || password.length > 128) {
        throw new AppError(
            500,
            "La contraseña del seed debe tener entre 8 y 128 caracteres.",
            "INVALID_SEED_CONFIGURATION",
        );
    }

    const created = await createAdminIfMissing({
        name,
        email,
        passwordHash: await hashPassword(password),
        role: parseRole(input.role),
    });

    return created
        ? "created"
        : "already-exists";
}
