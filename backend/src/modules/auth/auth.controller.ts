import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/http/apiResponse.js";
import { clearSessionCookie, readSessionToken, setSessionCookie } from "./auth.cookie.js";
import * as service from "./auth.service.js";
import type { LoginInput } from "./auth.types.js";
import type { CreateAdminAccountInput, UpdateAdminStatusInput } from "./auth.validation.js";
import { parsePositiveInt } from "../../shared/utils/parsePositiveInt.js";
export async function login(req: Request, res: Response): Promise<void> {
    const result = await service.login(req.body as LoginInput, {
        ipAddress: req.ip ?? null,
        userAgent: req.get("user-agent") ?? null,
    });
    setSessionCookie(res, result.sessionToken, result.expiresAt);
    sendSuccess(res, { admin: result.admin });
}
export function getCurrentAdmin(req: Request, res: Response): void {
    sendSuccess(res, { admin: req.admin! });
}
export async function logout(req: Request, res: Response): Promise<void> {
    const sessionToken = readSessionToken(req);
    if (sessionToken) {
        await service.logout(sessionToken);
    }
    clearSessionCookie(res);
    sendSuccess(res, null);
}
export async function getLoginHistory(_req: Request, res: Response): Promise<void> {
    sendSuccess(res, await service.getLoginHistory());
}

export async function listAdmins(_req: Request, res: Response): Promise<void> {
    sendSuccess(res, await service.getAdmins());
}

export async function createAdmin(req: Request, res: Response): Promise<void> {
    sendSuccess(res, await service.createAdminAccount(req.body as CreateAdminAccountInput), 201);
}

export async function updateAdminStatus(req: Request, res: Response): Promise<void> {
    const id = parsePositiveInt(req.params.id);
    const input = req.body as UpdateAdminStatusInput;
    sendSuccess(res, await service.updateAdminStatus(id, input.isActive));
}
