import { Router } from "express";
import { createRateLimitMiddleware } from "../../middlewares/rate-limit.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import * as quotesController from "./quotes.controller.js";
import { validateCreateQuoteBody } from "./validators/quotes.body.validator.js";

export const quotesRouter = Router();

quotesRouter.post(
    "/",
    createRateLimitMiddleware({
        windowMs: 15 * 60 * 1000,
        maxRequests: 10,
        errorCode: "QUOTE_RATE_LIMITED",
        errorMessage: "Has enviado demasiadas solicitudes de cotización. Inténtalo nuevamente más tarde.",
    }),
    validateBody(validateCreateQuoteBody),
    quotesController.createQuote,
);
