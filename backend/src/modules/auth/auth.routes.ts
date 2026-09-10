import {
    Router,
} from "express";

import {
    authenticateAdmin,
} from "../../middlewares/auth.middleware.js";

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

authRouter.post(
    "/login",
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
