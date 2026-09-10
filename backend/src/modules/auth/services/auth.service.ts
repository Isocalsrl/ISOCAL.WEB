import {
    createHash,
    randomBytes,
} from "node:crypto";
import bcrypt from "bcrypt";
import {
    env,
} from "../../../config/env.js";
import {
    AppError,
} from "../../../shared/errors/AppError.js";
import * as authRepository
    from "../repositories/index.js";
import type {
    Admin,
    LoginEvent,
    LoginInput,
    LoginMetadata,
    LoginResult,
} from "../auth.types.js";
import {
    normalizeLoginInput,
} from "./auth.normalizer.js";

const DUMMY_PASSWORD_HASH =
    "$2b$12$D.5wq.SNZgkUAGlOAKx14O9HWlqCEkaFixLzD186e6Euv3SkYi0IO";

function invalidCredentials(): never {
    throw new AppError(
        401,
        "Correo o contraseña incorrectos.",
        "INVALID_CREDENTIALS",
    );
}

export function hashSessionToken(
    token: string,
): string {
    return createHash("sha256")
        .update(token)
        .digest("hex");
}

export async function login(
    input: LoginInput,
    metadata: LoginMetadata,
): Promise<LoginResult> {
    const normalizedInput =
        normalizeLoginInput(input);

    const admin =
        await authRepository
            .findAdminByEmail(
                normalizedInput.email,
            );

    const passwordHash =
        admin?.passwordHash ??
        DUMMY_PASSWORD_HASH;

    const passwordMatches =
        await bcrypt.compare(
            normalizedInput.password,
            passwordHash,
        );

    const loginMetadata = {
        ipAddress:
            metadata.ipAddress
                ?.trim()
                .slice(0, 64) || null,
        userAgent:
            metadata.userAgent
                ?.trim()
                .slice(0, 512) || null,
    };

    if (!admin || !passwordMatches) {
        await authRepository.recordLoginEvent({
            adminId: admin?.id ?? null,
            attemptedEmail:
                normalizedInput.email,
            outcome: "invalid_credentials",
            ...loginMetadata,
        });

        invalidCredentials();
    }

    if (!admin.isActive) {
        await authRepository.recordLoginEvent({
            adminId: admin.id,
            attemptedEmail:
                normalizedInput.email,
            outcome: "inactive_account",
            ...loginMetadata,
        });

        invalidCredentials();
    }

    const sessionToken =
        randomBytes(32)
            .toString("base64url");

    const expiresAt =
        new Date(
            Date.now() +
                env.adminSessionDurationHours *
                    60 *
                    60 *
                    1000,
        );

    await authRepository
        .deleteExpiredSessions();

    await authRepository.createSession(
        admin.id,
        hashSessionToken(sessionToken),
        expiresAt,
        {
            adminId: admin.id,
            attemptedEmail:
                normalizedInput.email,
            outcome: "success",
            ...loginMetadata,
        },
    );

    const {
        passwordHash: _passwordHash,
        ...safeAdmin
    } = admin;

    return {
        admin: safeAdmin,
        sessionToken,
        expiresAt,
    };
}

export async function authenticateSession(
    token: string,
): Promise<Admin> {
    const tokenHash =
        hashSessionToken(token);

    const admin =
        await authRepository
            .findAdminBySessionHash(
                tokenHash,
            );

    if (!admin) {
        throw new AppError(
            401,
            "La sesión no es válida o ha expirado.",
            "UNAUTHENTICATED",
        );
    }

    return admin;
}

export async function logout(
    token: string,
): Promise<void> {
    const tokenHash =
        hashSessionToken(token);

    await authRepository
        .deleteSession(tokenHash);
}

export async function hashPassword(
    password: string,
): Promise<string> {
    return bcrypt.hash(
        password,
        12,
    );
}

export async function getLoginHistory():
    Promise<LoginEvent[]> {
    return authRepository
        .findRecentLoginEvents();
}
