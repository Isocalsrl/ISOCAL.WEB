import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    ApiError,
} from "../../../shared/api/httpClient";

import * as authApi from "../api/auth.api";

import type {
    LoginEvent,
} from "../types/auth.types";

export function useLoginHistory() {
    const [events, setEvents] = useState<LoginEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    const reload = useCallback((): void => {
        setReloadKey((current) => current + 1);
    }, []);

    useEffect(() => {
        let isActive = true;

        queueMicrotask(() => {
            if (!isActive) {
                return;
            }

            setErrorMessage(null);
            setIsLoading(true);
        });

        void authApi
            .getLoginHistory()
            .then((nextEvents) => {
                if (isActive) {
                    setEvents(nextEvents);
                }
            })
            .catch((error: unknown) => {
                if (isActive) {
                    setErrorMessage(
                        error instanceof ApiError
                            ? error.message
                            : "No se pudo cargar el registro de accesos.",
                    );
                }
            })
            .finally(() => {
                if (isActive) {
                    setIsLoading(false);
                }
            });

        return () => {
            isActive = false;
        };
    }, [reloadKey]);

    return {
        events,
        isLoading,
        errorMessage,
        reload,
    };
}
