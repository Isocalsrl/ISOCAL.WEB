import { useCallback, useEffect, useRef, useState } from "react";

export function useTransientFeedback(duration = 1100) {
    const [message, setMessage] = useState<string | null>(null);
    const timerRef = useRef<number | null>(null);

    const showFeedback = useCallback(
        (nextMessage: string) => {
            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current);
            }

            setMessage(nextMessage);
            timerRef.current = window.setTimeout(() => {
                setMessage(null);
                timerRef.current = null;
            }, duration);
        },
        [duration],
    );

    useEffect(
        () => () => {
            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current);
            }
        },
        [],
    );

    return {
        message,
        showFeedback,
    };
}
