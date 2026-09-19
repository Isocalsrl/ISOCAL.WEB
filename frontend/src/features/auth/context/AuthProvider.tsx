import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ApiError } from "../../../shared/api/httpClient";
import * as authApi
    from "../api/auth.api";
import type { Admin, AuthStatus, LoginCredentials } from "../types/auth.types";
import { AuthContext, type AuthContextValue } from "./auth.context";

interface AuthProviderProps {
    children: ReactNode;
}

interface AuthState {
    admin: Admin | null;
    status: AuthStatus;
}

async function resolveSession():
    Promise<AuthState> {
    try {
        const data =
            await authApi
                .getCurrentAdmin();

        return {
            admin: data.admin,
            status: "authenticated",
        };
    } catch (error) {
        if (
            error instanceof ApiError &&
            error.status === 401
        ) {
            return {
                admin: null,
                status: "anonymous",
            };
        }

        return {
            admin: null,
            status: "error",
        };
    }
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [
        authState,
        setAuthState,
    ] = useState<AuthState>({
        admin: null,
        status: "loading",
    });

    useEffect(() => {
        let isActive = true;

        void resolveSession()
            .then((nextState) => {
                if (isActive) {
                    setAuthState(
                        nextState,
                    );
                }
            });

        return () => {
            isActive = false;
        };
    }, []);

    const retrySession =
        useCallback(
            async (): Promise<void> => {
                setAuthState(
                    (currentState) => ({
                        ...currentState,
                        status: "loading",
                    }),
                );

                const nextState =
                    await resolveSession();

                setAuthState(nextState);
            },
            [],
        );

    const login =
        useCallback(
            async (
                credentials:
                    LoginCredentials,
            ): Promise<void> => {
                const data =
                    await authApi.login(
                        credentials,
                    );

                setAuthState({
                    admin: data.admin,
                    status:
                        "authenticated",
                });
            },
            [],
        );

    const logout =
        useCallback(
            async (): Promise<void> => {
                await authApi.logout();

                setAuthState({
                    admin: null,
                    status: "anonymous",
                });
            },
            [],
        );

    const value =
        useMemo<AuthContextValue>(
            () => ({
                admin:
                    authState.admin,

                status:
                    authState.status,

                login,
                logout,
                retrySession,
            }),
            [
                authState,
                login,
                logout,
                retrySession,
            ],
        );

    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
}
