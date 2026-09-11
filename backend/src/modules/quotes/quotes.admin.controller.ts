import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/http/apiResponse.js";
import { parsePositiveInt } from "../../shared/utils/parsePositiveInt.js";
import * as adminService from "./services/quotes.admin.service.js";
import type { QuoteCommercialDetailsInput, QuotePricingInput, QuoteRejectionInput } from "./quotes.types.js";

export async function listQuotes(req: Request, res: Response): Promise<void> {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    sendSuccess(res, await adminService.listAdminQuotes(req.admin!.role, status));
}

export async function getQuote(req: Request, res: Response): Promise<void> {
    sendSuccess(res, await adminService.getAdminQuote(parsePositiveInt(req.params.id), req.admin!.role));
}

export async function reviewQuote(req: Request, res: Response): Promise<void> {
    const quote = await adminService.reviewQuote(parsePositiveInt(req.params.id), req.admin!.id, req.admin!.role);
    sendSuccess(res, quote);
}

export async function updatePricing(req: Request, res: Response): Promise<void> {
    const quote = await adminService.priceQuote(parsePositiveInt(req.params.id), req.body as QuotePricingInput, req.admin!.id, req.admin!.role);
    sendSuccess(res, quote);
}

export async function updateCommercialDetails(req: Request, res: Response): Promise<void> {
    const quote = await adminService.editCommercialDetails(parsePositiveInt(req.params.id), req.body as QuoteCommercialDetailsInput, req.admin!.id, req.admin!.role);
    sendSuccess(res, quote);
}

export async function prepareQuote(req: Request, res: Response): Promise<void> {
    const quote = await adminService.prepare(parsePositiveInt(req.params.id), req.admin!.id, req.admin!.role);
    sendSuccess(res, quote);
}

export async function rejectQuote(req: Request, res: Response): Promise<void> {
    const quote = await adminService.reject(parsePositiveInt(req.params.id), req.body as QuoteRejectionInput, req.admin!.id, req.admin!.role);
    sendSuccess(res, quote);
}

export async function getHistory(req: Request, res: Response): Promise<void> {
    sendSuccess(res, await adminService.history(parsePositiveInt(req.params.id), req.admin!.role));
}
