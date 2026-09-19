import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";
import type { LoginEvent, LoginOutcome } from "../types/auth.types";

const OUTCOME_LABELS: Record<LoginOutcome, string> = {
    success: "Acceso correcto",
    invalid_credentials: "Credenciales incorrectas",
    inactive_account: "Cuenta inactiva",
};

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("es-PE", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export function LoginHistoryTable({ events }: { events: readonly LoginEvent[] }) {
    return (
        <div className="admin-access-list">
            {events.map((event) => (
                <article className="admin-access-card" key={event.id}>
                    <div className={`admin-access-icon admin-access-icon-${event.outcome}`}>
                        <CorporateIcon name={event.outcome === "success" ? "check" : "lock"} />
                    </div>
                    <div className="admin-access-main">
                        <div className="admin-access-heading">
                            <div>
                                <strong>{event.adminName ?? "Cuenta no identificada"}</strong>
                                <span>{event.attemptedEmail}</span>
                            </div>
                            <span className={`access-outcome access-outcome-${event.outcome}`}>
                                {OUTCOME_LABELS[event.outcome]}
                            </span>
                        </div>
                        <div className="admin-access-meta">
                            <span><CorporateIcon name="clock" /> {formatDate(event.occurredAt)}</span>
                            <span><CorporateIcon name="pin" /> {event.ipAddress ?? "IP no disponible"}</span>
                            <span title={event.userAgent ?? undefined}><CorporateIcon name="info" /> {event.userAgent ?? "Dispositivo no disponible"}</span>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
