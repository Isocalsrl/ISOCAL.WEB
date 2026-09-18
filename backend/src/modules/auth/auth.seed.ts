import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors/AppError.js";
import * as repository from "./auth.repository.js";
import { hashPassword } from "./auth.service.js";
import type { AdminRole } from "./auth.types.js";

export type SeedAdminResult = "created" | "already-exists";
export type ConfiguredSuperAdminResult = SeedAdminResult | "skipped";

export interface SeedAdminInput {
    name: string;
    email: string;
    password: string;
    role: string;
}

function parseRole(value: string): AdminRole {
    if (value === "admin" || value === "super_admin") return value;
    throw new AppError(
        500,
        "El rol del seed debe ser admin o super_admin.",
        "INVALID_SEED_CONFIGURATION",
    );
}

export async function seedAdmin(input: SeedAdminInput): Promise<SeedAdminResult> {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new AppError(
            500,
            "Los datos del seed de administrador no son válidos.",
            "INVALID_SEED_CONFIGURATION",
        );
    }
    if (input.password.length < 12 || input.password.length > 128) {
        throw new AppError(
            500,
            "La contraseña inicial debe tener entre 12 y 128 caracteres.",
            "INVALID_SEED_CONFIGURATION",
        );
    }

    const created = await repository.createAdminIfMissing({
        name,
        email,
        passwordHash: await hashPassword(input.password),
        role: parseRole(input.role),
    });
    return created ? "created" : "already-exists";
}

export async function seedConfiguredSuperAdmin(): Promise<ConfiguredSuperAdminResult> {
    const credentials = [env.bootstrapSuperAdminName, env.bootstrapSuperAdminEmail, env.bootstrapSuperAdminPassword];
    const configured = credentials.filter(Boolean).length;

    if (configured === 0) return "skipped";
    if (configured !== credentials.length) {
        throw new AppError(
            500,
            "BOOTSTRAP_SUPER_ADMIN_NAME, BOOTSTRAP_SUPER_ADMIN_EMAIL y BOOTSTRAP_SUPER_ADMIN_PASSWORD deben configurarse juntos.",
            "INVALID_SEED_CONFIGURATION",
        );
    }

    return seedAdmin({
        name: env.bootstrapSuperAdminName!,
        email: env.bootstrapSuperAdminEmail!,
        password: env.bootstrapSuperAdminPassword!,
        role: "super_admin",
    });
}
