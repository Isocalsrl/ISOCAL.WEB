import {
    createContext,
} from "react";

import type {
    Admin,
    AuthStatus,
    LoginCredentials,
} from "../types/auth.types";

export interface AuthContextValue {
    admin: Admin | null;
    status: AuthStatus;

    login: (
        credentials: LoginCredentials,
    ) => Promise<void>;

    logout: () => Promise<void>;

    retrySession:
        () => Promise<void>;
}

export const AuthContext =
    createContext<AuthContextValue | null>(
        null,
    );
