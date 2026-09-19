import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/AppError.js";
import { readSessionToken } from "./auth.cookie.js";
import * as authService from "./auth.service.js";

export async function authenticateAdmin(
    req: Request,
    _res: Response,
    next: NextFunction,
): Promise<void> {
    const sessionToken = readSessionToken(req);
    if (!sessionToken) {
        throw new AppError(
            401,
            "Debes iniciar sesión para acceder a este recurso.",
            "UNAUTHENTICATED",
        );
    }

    req.admin = await authService.authenticateSession(sessionToken);
    next();
}
