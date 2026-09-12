import {
    Router,
} from "express";

import {
    authenticateAdmin,
} from "../../middlewares/auth.middleware.js";

import {
    createRateLimitMiddleware,
} from "../../middlewares/rate-limit.middleware.js";

import {
    requireAdminRole,
} from "../../middlewares/role.middleware.js";

import {
    validateBody,
} from "../../middlewares/validate.middleware.js";

import * as authController
    from "./auth.controller.js";

import {
    validateLoginBody,
} from "./validators/auth.body.validator.js";

export const authRouter =
    Router();

const loginRateLimit =
    createRateLimitMiddleware({
        windowMs:
            15 * 60 * 1000,
        maxRequests: 10,
        errorCode:
            "LOGIN_RATE_LIMITED",
        errorMessage:
            "Se realizaron demasiados intentos de acceso. Inténtalo nuevamente más tarde.",
    });

authRouter.post(
    "/login",
    loginRateLimit,
    validateBody(
        validateLoginBody,
    ),
    authController.login,
);

authRouter.post(
    "/logout",
    authController.logout,
);

authRouter.get(
    "/me",
    authenticateAdmin,
    authController.getCurrentAdmin,
);

authRouter.get(
    "/login-history",
    authenticateAdmin,
    requireAdminRole("super_admin"),
    authController.getLoginHistory,
);
