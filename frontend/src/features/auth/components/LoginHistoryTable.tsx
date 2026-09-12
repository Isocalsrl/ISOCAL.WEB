import type {
    LoginEvent,
    LoginOutcome,
} from "../types/auth.types";

const OUTCOME_LABELS: Record<LoginOutcome, string> = {
    success: "Acceso correcto",
    invalid_credentials: "Credenciales incorrectas",
    inactive_account: "Cuenta inactiva",
};

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("es-PE", {
        dateStyle: "medium",
        timeStyle: "medium",
    }).format(new Date(value));
}

interface LoginHistoryTableProps {
    events: readonly LoginEvent[];
}

export function LoginHistoryTable({
    events,
}: LoginHistoryTableProps) {
    return (
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
                    {events.map((event) => (
                        <tr key={event.id}>
                            <td>
                                <span className="data-date">
                                    {formatDate(event.occurredAt)}
                                </span>
                            </td>

                            <td>
                                <div className="data-primary">
                                    <strong>
                                        {event.adminName ??
                                            "Cuenta no identificada"}
                                    </strong>
                                    <span>{event.attemptedEmail}</span>
                                </div>
                            </td>

                            <td>
                                <span
                                    className={`access-outcome access-outcome-${event.outcome}`}
                                >
                                    {OUTCOME_LABELS[event.outcome]}
                                </span>
                            </td>

                            <td>{event.ipAddress ?? "No disponible"}</td>

                            <td>
                                <span
                                    className="access-user-agent"
                                    title={event.userAgent ?? undefined}
                                >
                                    {event.userAgent ?? "No disponible"}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
