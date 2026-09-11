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

import {
    LoginHistoryTable,
} from "../components/LoginHistoryTable";

import {
    useLoginHistory,
} from "../hooks/useLoginHistory";

export function LoginHistoryPage() {
    const history = useLoginHistory();

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
                        onClick={history.reload}
                        disabled={history.isLoading}
                    >
                        Actualizar registro
                    </Button>
                }
            />

            {history.errorMessage && history.events.length > 0 && (
                <InlineAlert>{history.errorMessage}</InlineAlert>
            )}

            {history.isLoading ? (
                <SectionState
                    title="Cargando accesos"
                    description="Consultando la actividad administrativa reciente."
                    isLoading
                />
            ) : history.errorMessage && history.events.length === 0 ? (
                <SectionState
                    title="No se pudo cargar el registro"
                    description={history.errorMessage}
                    actionLabel="Reintentar"
                    onAction={history.reload}
                />
            ) : history.events.length === 0 ? (
                <SectionState
                    title="Sin accesos registrados"
                    description="Los próximos intentos de ingreso aparecerán en esta sección."
                />
            ) : (
                <>
                    <div className="management-summary">
                        <p className="management-count">
                            <strong>{history.events.length}</strong>{" "}
                            eventos recientes
                        </p>
                    </div>

                    <LoginHistoryTable events={history.events} />
                </>
            )}
        </section>
    );
}
