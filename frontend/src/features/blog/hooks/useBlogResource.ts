import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../../../shared/api/httpClient";

export function useBlogResource<T>(load: (signal: AbortSignal) => Promise<T>) {
    const [revision, setRevision] = useState(0);
    const [state, setState] = useState<{ load: typeof load; revision: number; data: T | null; error: ApiError | null } | null>(null);
    useEffect(() => {
        const controller = new AbortController();
        void load(controller.signal).then(data => {
            if (!controller.signal.aborted) setState({ load, revision, data, error: null });
        }).catch((error: unknown) => {
            if (!controller.signal.aborted) setState({ load, revision, data: null,
                error: error instanceof ApiError ? error : new ApiError(0, 'BLOG_LOAD_FAILED', 'No se pudo cargar el blog. Inténtalo nuevamente.') });
        });
        return () => controller.abort();
    }, [load, revision]);
    const current = state?.load === load && state.revision === revision ? state : null;
    return { data: current?.data ?? null, error: current?.error ?? null, isLoading: !current,
        reload: useCallback(() => setRevision(value => value + 1), []) };
}
