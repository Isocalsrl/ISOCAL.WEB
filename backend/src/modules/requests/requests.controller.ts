import type { Request, Response } from 'express';
import { sendSuccess } from '../../shared/http/apiResponse.js';
import { parseRequestSubmission } from './requests.validator.js';
import { sendRequest } from './requests.service.js';
export async function submitRequest(req: Request, res: Response) {
    res.setHeader('Cache-Control', 'no-store');
    sendSuccess(res, await sendRequest(parseRequestSubmission(req.body)), 201);
}
