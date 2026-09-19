import { useRef, useState } from "react";
import { ApiError } from "../../../shared/api/httpClient";
import { submitRequest } from "../api/requests.api";
import type { RequestReceipt, RequestSubmission } from '../model/request.types';

export function useRequestSubmission(onSuccess?: () => void) {
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [receipt, setReceipt] = useState<RequestReceipt | null>(null);
    const locked = useRef(false);
    const attempt = useRef<{ payload: string; id: string } | null>(null);
    async function submit(input: RequestSubmission) {
        if (locked.current) return;
        locked.current = true; setBusy(true); setError('');
        const payload = JSON.stringify(input);
        if (attempt.current?.payload !== payload) attempt.current = { payload, id: crypto.randomUUID() };
        try {
            setReceipt(await submitRequest({ ...input, requestId: attempt.current.id }));
            onSuccess?.();
        } catch (error) {
            setError(error instanceof ApiError ? error.message : 'No pudimos enviar la solicitud. Inténtalo nuevamente.');
        } finally { locked.current = false; setBusy(false); }
    }
    return { busy, error, receipt, submit };
}
