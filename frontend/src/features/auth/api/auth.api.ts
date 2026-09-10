import {
    request,
} from "../../../shared/api/httpClient";

import type {
    AuthData,
    LoginEvent,
    LoginCredentials,
} from "../types/auth.types";

const AUTH_PATH =
    "/api/admin/auth";

export function login(
    credentials: LoginCredentials,
): Promise<AuthData> {
    return request<AuthData>(
        `${AUTH_PATH}/login`,
        {
            method: "POST",
            body: JSON.stringify(
                credentials,
            ),
        },
    );
}

export function getCurrentAdmin():
    Promise<AuthData> {
    return request<AuthData>(
        `${AUTH_PATH}/me`,
    );
}

export function logout():
    Promise<null> {
    return request<null>(
        `${AUTH_PATH}/logout`,
        {
            method: "POST",
        },
    );
}

export function getLoginHistory():
    Promise<LoginEvent[]> {
    return request<LoginEvent[]>(
        `${AUTH_PATH}/login-history`,
    );
}
