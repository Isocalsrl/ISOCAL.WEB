import type {
    Request,
    Response,
} from "express";

import {
    sendSuccess,
} from "../../shared/http/apiResponse.js";

import {
    clearSessionCookie,
    readSessionToken,
    setSessionCookie,
} from "./auth.cookie.js";

import * as authService
    from "./services/auth.service.js";

import type {
    LoginInput,
} from "./auth.types.js";

export async function login(
    req: Request,
    res: Response,
): Promise<void> {
    const result =
        await authService.login(
            req.body as LoginInput,
            {
                ipAddress:
                    req.ip ?? null,
                userAgent:
                    req.get("user-agent") ??
                    null,
            },
        );

    setSessionCookie(
        res,
        result.sessionToken,
        result.expiresAt,
    );

    sendSuccess(
        res,
        {
            admin: result.admin,
        },
    );
}

export function getCurrentAdmin(
    req: Request,
    res: Response,
): void {
    sendSuccess(
        res,
        {
            admin: req.admin!,
        },
    );
}

export async function logout(
    req: Request,
    res: Response,
): Promise<void> {
    const sessionToken =
        readSessionToken(req);

    if (sessionToken) {
        await authService.logout(
            sessionToken,
        );
    }

    clearSessionCookie(res);

    sendSuccess(
        res,
        null,
    );
}

export async function getLoginHistory(
    _req: Request,
    res: Response,
): Promise<void> {
    const events =
        await authService
            .getLoginHistory();

    sendSuccess(
        res,
        events,
    );
}
