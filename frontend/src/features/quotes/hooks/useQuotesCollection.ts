import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../../../shared/api/httpClient";
import { listQuotes } from "../api/quotes.api";
import type { QuoteListItem, QuoteStatus } from "../types/quote.types";
export function useQuotesCollection(status?: QuoteStatus) {
    const [quotes, setQuotes] = useState<QuoteListItem[]>([]); const [isLoading, setIsLoading] = useState(true); const [errorMessage, setErrorMessage] = useState<string | null>(null); const [reloadKey, setReloadKey] = useState(0);
    const reload = useCallback(() => setReloadKey((value) => value + 1), []);
    useEffect(() => { let active = true; queueMicrotask(() => { if (active) { setIsLoading(true); setErrorMessage(null); } }); void listQuotes(status).then((data) => { if (active) setQuotes(data); }).catch((error: unknown) => { if (active) setErrorMessage(error instanceof ApiError ? error.message : "No se pudieron cargar las cotizaciones."); }).finally(() => { if (active) setIsLoading(false); }); return () => { active = false; }; }, [reloadKey, status]);
    return { quotes, isLoading, errorMessage, reload };
}
