import type {
    NextFunction,
    Request,
    Response,
} from "express";

import type {
    AdminRole,
} from "../modules/auth/auth.types.js";

import {
    AppError,
} from "../shared/errors/AppError.js";

export function requireAdminRole(
    ...allowedRoles: AdminRole[]
) {
    return function authorizeAdminRole(
        req: Request,
        _res: Response,
        next: NextFunction,
    ): void {
        if (!req.admin) {
            throw new AppError(
                401,
                "Debes iniciar sesión para acceder a este recurso.",
                "UNAUTHENTICATED",
            );
        }

        if (!allowedRoles.includes(req.admin.role)) {
            throw new AppError(
                403,
                "No tienes permisos para acceder a este recurso.",
                "FORBIDDEN",
            );
        }

        next();
    };
}
