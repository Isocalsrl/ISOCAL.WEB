import { Router } from "express";
import type { RequestHandler } from "express";
import { requireAdminRole } from "../../middlewares/role.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import * as controller from "./quotes.admin.controller.js";
import { validateCommercialDetailsBody, validatePricingBody, validateRejectionBody } from "./validators/quotes.admin.body.validator.js";

export function createAdminQuotesRouter(authenticateAdmin: RequestHandler): Router {
    const router = Router();
    router.use(authenticateAdmin);
    router.get("/", controller.listQuotes);
    router.get("/:id", controller.getQuote);
    router.post("/:id/review", controller.reviewQuote);
    router.patch("/:id/pricing", requireAdminRole("super_admin"), validateBody(validatePricingBody), controller.updatePricing);
    router.patch("/:id/commercial-details", requireAdminRole("super_admin"), validateBody(validateCommercialDetailsBody), controller.updateCommercialDetails);
    router.post("/:id/prepare", requireAdminRole("super_admin"), controller.prepareQuote);
    router.post("/:id/reject", requireAdminRole("super_admin"), validateBody(validateRejectionBody), controller.rejectQuote);
    router.get("/:id/history", requireAdminRole("super_admin"), controller.getHistory);
    return router;
}
