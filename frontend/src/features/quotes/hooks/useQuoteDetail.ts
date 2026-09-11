import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    ApiError,
} from "../../../shared/api/httpClient";
import {
    getQuote,
    getQuoteHistory,
} from "../api/quotes.api";
import type {
    QuoteDetail,
    QuoteHistoryEvent,
} from "../types/quote.types";

export function useQuoteDetail(id: number) {
    const [quote, setQuote] = useState<QuoteDetail | null>(null);
    const [history, setHistory] = useState<QuoteHistoryEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    const reload = useCallback(() => {
        setReloadKey((value) => value + 1);
    }, []);

    useEffect(() => {
        let active = true;

        queueMicrotask(() => {
            if (active) {
                setIsLoading(true);
                setErrorMessage(null);
            }
        });

        void getQuote(id)
            .then((data) => {
                if (active) {
                    setQuote(data);
                }

                return getQuoteHistory(id).catch(
                    () => [] as QuoteHistoryEvent[],
                );
            })
            .then((events) => {
                if (active) {
                    setHistory(events);
                }
            })
            .catch((error: unknown) => {
                if (active) {
                    setErrorMessage(
                        error instanceof ApiError
                            ? error.message
                            : "No se pudo cargar la cotización.",
                    );
                }
            })
            .finally(() => {
                if (active) {
                    setIsLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [id, reloadKey]);

    return {
        quote,
        history,
        isLoading,
        errorMessage,
        reload,
        setQuote,
    };
}
