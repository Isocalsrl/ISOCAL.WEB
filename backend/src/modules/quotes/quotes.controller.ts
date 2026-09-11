import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/http/apiResponse.js";
import * as quotesService from "./services/quotes.service.js";
import type { CreateQuoteInput } from "./quotes.types.js";

export async function createQuote(
    req: Request,
    res: Response,
): Promise<void> {
    const quote = await quotesService.createPublicQuote(
        req.body as CreateQuoteInput,
    );

    sendSuccess(res, { quote }, 201);
}
