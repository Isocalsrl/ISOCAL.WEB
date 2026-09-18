import type { CookieOptions, Request, Response } from "express";
import { env } from "../../config/env.js";
export const ADMIN_SESSION_COOKIE = "isocal_admin_session";
function cookieOptions(): CookieOptions {
    return {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: "lax",
        path: "/api/admin",
    };
}
export function readSessionToken(req: Request): string | null {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader)
        return null;
    for (const cookie of cookieHeader.split(";")) {
        const [name, ...valueParts] = cookie.trim().split("=");
        if (name !== ADMIN_SESSION_COOKIE)
            continue;
        try {
            return decodeURIComponent(valueParts.join("="));
        }
        catch {
            return null;
        }
    }
    return null;
}
export function setSessionCookie(res: Response, token: string, expiresAt: Date): void {
    res.cookie(ADMIN_SESSION_COOKIE, token, {
        ...cookieOptions(),
        expires: expiresAt,
    });
}
export function clearSessionCookie(res: Response): void {
    res.clearCookie(ADMIN_SESSION_COOKIE, cookieOptions());
}
