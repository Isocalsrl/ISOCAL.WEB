import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors/AppError.js";
import * as repository from "./auth.repository.js";
import type { Admin, LoginEvent, LoginInput, LoginMetadata, LoginResult } from "./auth.types.js";
const dummyPasswordHash = "$2b$12$D.5wq.SNZgkUAGlOAKx14O9HWlqCEkaFixLzD186e6Euv3SkYi0IO";
function invalidCredentials(): never {
    throw new AppError(401, "Correo o contraseña incorrectos.", "INVALID_CREDENTIALS");
}
function normalizeLogin(input: LoginInput): LoginInput {
    return {
        email: input.email.trim().toLowerCase(),
        password: input.password,
    };
}
function normalizeMetadata(metadata: LoginMetadata): LoginMetadata {
    return {
        ipAddress: metadata.ipAddress?.trim().slice(0, 64) || null,
        userAgent: metadata.userAgent?.trim().slice(0, 512) || null,
    };
}
export function hashSessionToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
}
export function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}
export async function login(input: LoginInput, metadata: LoginMetadata): Promise<LoginResult> {
    const normalized = normalizeLogin(input);
    const loginMetadata = normalizeMetadata(metadata);
    const admin = await repository.findAdminByEmail(normalized.email);
    const passwordMatches = await bcrypt.compare(normalized.password, admin?.passwordHash ?? dummyPasswordHash);
    if (!admin || !passwordMatches) {
        await repository.recordLoginEvent({
            adminId: admin?.id ?? null,
            attemptedEmail: normalized.email,
            outcome: "invalid_credentials",
            ...loginMetadata,
        });
        invalidCredentials();
    }
    if (!admin.isActive) {
        await repository.recordLoginEvent({
            adminId: admin.id,
            attemptedEmail: normalized.email,
            outcome: "inactive_account",
            ...loginMetadata,
        });
        invalidCredentials();
    }
    const sessionToken = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + env.adminSessionDurationHours * 60 * 60 * 1000);
    await repository.deleteExpiredSessions();
    await repository.createSession(admin.id, hashSessionToken(sessionToken), expiresAt, {
        adminId: admin.id,
        attemptedEmail: normalized.email,
        outcome: "success",
        ...loginMetadata,
    });
    const { passwordHash: _passwordHash, ...safeAdmin } = admin;
    return {
        admin: safeAdmin,
        sessionToken,
        expiresAt,
    };
}
export async function authenticateSession(token: string): Promise<Admin> {
    const admin = await repository.findAdminBySessionHash(hashSessionToken(token));
    if (!admin) {
        throw new AppError(401, "La sesión no es válida o ha expirado.", "UNAUTHENTICATED");
    }
    return admin;
}
export function logout(token: string): Promise<void> {
    return repository.deleteSession(hashSessionToken(token));
}
export function getLoginHistory(): Promise<LoginEvent[]> {
    return repository.findRecentLoginEvents();
}

export function getAdmins(): Promise<Admin[]> {
    return repository.findAdmins();
}

export async function createAdminAccount(input: {
    name: string;
    email: string;
    password: string;
}): Promise<Admin> {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();
    const existing = await repository.findAdminByEmail(email);
    if (existing) {
        throw new AppError(409, "Ya existe una cuenta con ese correo.", "ADMIN_EMAIL_EXISTS");
    }

    return repository.createAdmin({
        name,
        email,
        passwordHash: await hashPassword(input.password),
        role: "admin",
    });
}

export async function updateAdminStatus(
    targetAdminId: number,
    isActive: boolean,
): Promise<Admin> {
    const updated = await repository.setAdminActive(targetAdminId, isActive);
    if (!updated) {
        throw new AppError(
            404,
            "No se encontró un administrador editable con ese identificador.",
            "ADMIN_NOT_FOUND",
        );
    }
    return updated;
}
