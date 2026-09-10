import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    ApiError,
} from "../../../shared/api/httpClient";

import {
    InlineAlert,
} from "../../../shared/components/feedback/InlineAlert";

import {
    Button,
} from "../../../shared/components/ui/Button";

import {
    SectionState,
} from "../../../shared/components/ui/SectionState";

import {
    ManagementHeader,
} from "../../admin/components/ManagementHeader";

import * as authApi
    from "../api/auth.api";

import type {
    LoginEvent,
    LoginOutcome,
} from "../types/auth.types";

const OUTCOME_LABELS: Record<
    LoginOutcome,
    string
> = {
    success: "Acceso correcto",
    invalid_credentials:
        "Credenciales incorrectas",
    inactive_account:
        "Cuenta inactiva",
};

function formatDate(
    value: string,
): string {
    return new Intl.DateTimeFormat(
        "es-PE",
        {
            dateStyle: "medium",
            timeStyle: "medium",
        },
    ).format(new Date(value));
}

export function LoginHistoryPage() {
    const [
        events,
        setEvents,
    ] = useState<LoginEvent[]>([]);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(null);

    const loadEvents =
        useCallback(
            async (): Promise<void> => {
                setErrorMessage(null);
                setIsLoading(true);

                try {
                    setEvents(
                        await authApi
                            .getLoginHistory(),
                    );
                } catch (error) {
                    setErrorMessage(
                        error instanceof ApiError
                            ? error.message
                            : "No se pudo cargar el registro de accesos.",
                    );
                } finally {
                    setIsLoading(false);
                }
            },
            [],
        );

    useEffect(() => {
        let isActive = true;

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
    }, []);

    return (
        <section className="management-page">
            <ManagementHeader
                eyebrow="Seguridad"
                title="Registro de accesos"
                description="Consulta los intentos recientes de ingreso al panel administrativo."
                actions={
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            void loadEvents();
                        }}
                        disabled={isLoading}
                    >
                        Actualizar registro
                    </Button>
                }
            />

            {errorMessage &&
                events.length > 0 && (
                    <InlineAlert>
                        {errorMessage}
                    </InlineAlert>
                )}

            {isLoading ? (
                <SectionState
                    title="Cargando accesos"
                    description="Consultando la actividad administrativa reciente."
                    isLoading
                />
            ) : errorMessage &&
              events.length === 0 ? (
                <SectionState
                    title="No se pudo cargar el registro"
                    description={errorMessage}
                    actionLabel="Reintentar"
                    onAction={() => {
                        void loadEvents();
                    }}
                />
            ) : events.length === 0 ? (
                <SectionState
                    title="Sin accesos registrados"
                    description="Los próximos intentos de ingreso aparecerán en esta sección."
                />
            ) : (
                <>
                    <div className="management-summary">
                        <p className="management-count">
                            <strong>
                                {events.length}
                            </strong>{" "}
                            eventos recientes
                        </p>
                    </div>

                    <div className="data-panel">
                        <table className="data-table access-table">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Administrador</th>
                                    <th>Resultado</th>
                                    <th>Dirección IP</th>
                                    <th>Dispositivo</th>
                                </tr>
                            </thead>

                            <tbody>
                                {events.map(
                                    (event) => (
                                        <tr key={event.id}>
                                            <td>
                                                <span className="data-date">
                                                    {formatDate(
                                                        event.occurredAt,
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="data-primary">
                                                    <strong>
                                                        {event.adminName ??
                                                            "Cuenta no identificada"}
                                                    </strong>
                                                    <span>
                                                        {event.attemptedEmail}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                <span
                                                    className={`access-outcome access-outcome-${event.outcome}`}
                                                >
                                                    {OUTCOME_LABELS[
                                                        event.outcome
                                                    ]}
                                                </span>
                                            </td>

                                            <td>
                                                {event.ipAddress ??
                                                    "No disponible"}
                                            </td>

                                            <td>
                                                <span
                                                    className="access-user-agent"
                                                    title={
                                                        event.userAgent ??
                                                        undefined
                                                    }
                                                >
                                                    {event.userAgent ??
                                                        "No disponible"}
                                                </span>
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </section>
    );
}
