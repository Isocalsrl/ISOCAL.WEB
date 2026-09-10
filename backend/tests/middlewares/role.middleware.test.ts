import type {
    NextFunction,
    Request,
    Response,
} from "express";

import {
    describe,
    expect,
    it,
    vi,
} from "vitest";

import {
    requireAdminRole,
} from "../../src/middlewares/role.middleware.js";

import type {
    Admin,
    AdminRole,
} from "../../src/modules/auth/auth.types.js";

function createRequest(
    role?: AdminRole,
): Request {
    const request = {} as Request;

    if (role) {
        const now = new Date();

        request.admin = {
            id: 1,
            name: "Administrador de prueba",
            email: "admin@test.local",
            role,
            isActive: true,
            lastLoginAt: now,
            createdAt: now,
            updatedAt: now,
        } satisfies Admin;
    }

    return request;
}

describe("requireAdminRole", () => {
    const response = {} as Response;

    it("rechaza solicitudes sin sesión", () => {
        const middleware =
            requireAdminRole(
                "super_admin",
            );

        expect(() =>
            middleware(
                createRequest(),
                response,
                vi.fn() as NextFunction,
            ),
        ).toThrowError(
            expect.objectContaining({
                statusCode: 401,
                code: "UNAUTHENTICATED",
            }),
        );
    });

    it("rechaza un rol sin autorización", () => {
        const middleware =
            requireAdminRole(
                "super_admin",
            );

        expect(() =>
            middleware(
                createRequest("admin"),
                response,
                vi.fn() as NextFunction,
            ),
        ).toThrowError(
            expect.objectContaining({
                statusCode: 403,
                code: "FORBIDDEN",
            }),
        );
    });

    it("permite el rol autorizado", () => {
        const middleware =
            requireAdminRole(
                "super_admin",
            );

        const next = vi.fn();

        middleware(
            createRequest(
                "super_admin",
            ),
            response,
            next,
        );

        expect(next)
            .toHaveBeenCalledOnce();
    });
});
