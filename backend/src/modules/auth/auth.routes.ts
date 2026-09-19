import { Router } from "express";
import { authenticateAdmin } from "./auth.middleware.js";
import { createRateLimitMiddleware } from "../../middlewares/rate-limit.middleware.js";
import { requireAdminRole } from "./auth.authorization.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import * as controller from "./auth.controller.js";
import { validateAdminStatusBody, validateCreateAdminBody, validateLoginBody } from "./auth.validation.js";
export const authRouter = Router();
const loginRateLimit = createRateLimitMiddleware({
    windowMs: 15 * 60 * 1000,
    maxRequests: 10,
    errorCode: "LOGIN_RATE_LIMITED",
    errorMessage: "Se realizaron demasiados intentos de acceso. Inténtalo nuevamente más tarde.",
});
authRouter.post("/login", loginRateLimit, validateBody(validateLoginBody), controller.login);
authRouter.post("/logout", controller.logout);
authRouter.get("/me", authenticateAdmin, controller.getCurrentAdmin);
authRouter.get("/login-history", authenticateAdmin, requireAdminRole("super_admin"), controller.getLoginHistory);

authRouter.get("/admins", authenticateAdmin, requireAdminRole("super_admin"), controller.listAdmins);
authRouter.post(
    "/admins",
    authenticateAdmin,
    requireAdminRole("super_admin"),
    validateBody(validateCreateAdminBody),
    controller.createAdmin,
);
authRouter.patch(
    "/admins/:id/status",
    authenticateAdmin,
    requireAdminRole("super_admin"),
    validateBody(validateAdminStatusBody),
    controller.updateAdminStatus,
);
