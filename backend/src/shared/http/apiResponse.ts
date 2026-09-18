import type { Response } from "express";
import type { ApiSuccess } from "../types/api.types.js";
export function sendSuccess<T>(res: Response, data: T, statusCode = 200): Response<ApiSuccess<T>> {
    return res.status(statusCode).json({
        success: true,
        data,
    });
}
