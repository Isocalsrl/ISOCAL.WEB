import type { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError } from "../shared/errors/AppError.js";

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

export interface RateLimitOptions {
    windowMs: number;
    maxRequests: number;
    errorCode?: string;
    errorMessage?: string;
}

function getClientKey(req: Request): string {
    return req.ip || req.socket.remoteAddress || "unknown";
}

export function createRateLimitMiddleware(
    options: RateLimitOptions,
): RequestHandler {
    const attemptsByClient = new Map<string, RateLimitEntry>();

    return (req: Request, res: Response, next: NextFunction): void => {
        const now = Date.now();

        for (const [key, entry] of attemptsByClient) {
            if (entry.resetAt <= now) attemptsByClient.delete(key);
        }

        const clientKey = getClientKey(req);
        const current = attemptsByClient.get(clientKey);

        if (!current || current.resetAt <= now) {
            attemptsByClient.set(clientKey, {
                count: 1,
                resetAt: now + options.windowMs,
            });
            next();
            return;
        }

        if (current.count >= options.maxRequests) {
            const retryAfterSeconds = Math.max(
                1,
                Math.ceil((current.resetAt - now) / 1000),
            );
            res.setHeader("Retry-After", retryAfterSeconds);
            next(
                new AppError(
                    429,
                    options.errorMessage ?? "Demasiadas solicitudes. Inténtalo más tarde.",
                    options.errorCode ?? "RATE_LIMITED",
                ),
            );
            return;
        }

        current.count += 1;
        next();
    };
}
