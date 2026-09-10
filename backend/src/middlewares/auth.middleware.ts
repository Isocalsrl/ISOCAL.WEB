import type {
    NextFunction,
    Request,
    Response,
} from "express";

import {
    readSessionToken,
} from "../modules/auth/auth.cookie.js";

import * as authService
    from "../modules/auth/services/auth.service.js";

import {
    AppError,
} from "../shared/errors/AppError.js";

export async function authenticateAdmin(
    req: Request,
    _res: Response,
    next: NextFunction,
): Promise<void> {
    const sessionToken =
        readSessionToken(req);

    if (!sessionToken) {
        throw new AppError(
            401,
            "Debes iniciar sesión para acceder a este recurso.",
            "UNAUTHENTICATED",
        );
    }

    req.admin =
        await authService
            .authenticateSession(
                sessionToken,
            );

    next();
}

export const authMiddleware =
    authenticateAdmin;
