import {
    useState,
} from "react";

import {
    FullPageMessage,
} from "../../../shared/components/feedback/FullPageMessage";

import {
    useAuth,
} from "../hooks/useAuth";

export function AuthSessionError() {
    const {
        retrySession,
    } = useAuth();

    const [
        isRetrying,
        setIsRetrying,
    ] = useState(false);

    async function handleRetry():
        Promise<void> {
        setIsRetrying(true);

        try {
            await retrySession();
        } finally {
            setIsRetrying(false);
        }
    }

    return (
        <FullPageMessage
            title="No pudimos verificar tu sesión"
            description="Comprueba que la API esté encendida y vuelve a intentarlo."
            actionLabel={
                isRetrying
                    ? "Reintentando..."
                    : "Reintentar"
            }
            actionDisabled={isRetrying}
            onAction={() => {
                void handleRetry();
            }}
        />
    );
}
