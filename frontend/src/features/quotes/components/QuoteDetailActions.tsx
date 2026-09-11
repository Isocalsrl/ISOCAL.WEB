import { Button } from "../../../shared/components/ui/Button";
import type { QuoteActionsState } from "../hooks/useQuoteActions";
import type { QuoteDetail } from "../types/quote.types";

interface QuoteDetailActionsProps {
    quote: QuoteDetail;
    isSuperAdmin: boolean;
    actions: QuoteActionsState;
    onReload: () => void;
}

export function QuoteDetailActions({
    quote,
    isSuperAdmin,
    actions,
    onReload,
}: QuoteDetailActionsProps) {
    return (
        <div className="quote-detail-actions">
            {quote.permissions.canReview && (
                <Button
                    type="button"
                    isLoading={actions.isSaving}
                    onClick={() => {
                        void actions.startReview();
                    }}
                >
                    Iniciar revisión
                </Button>
            )}

            {isSuperAdmin && quote.permissions.canPrepare && (
                <Button
                    type="button"
                    isLoading={actions.isSaving}
                    onClick={() => {
                        void actions.prepare();
                    }}
                >
                    Preparar envío
                </Button>
            )}

            {isSuperAdmin && quote.status === "ready_to_send" && (
                <Button
                    type="button"
                    isLoading={actions.isSaving}
                    onClick={() => actions.requestDelivery("send")}
                >
                    Enviar al cliente
                </Button>
            )}

            {isSuperAdmin && quote.status === "sent" && (
                <Button
                    type="button"
                    variant="secondary"
                    isLoading={actions.isSaving}
                    onClick={() => actions.requestDelivery("resend")}
                >
                    Reenviar cotización
                </Button>
            )}

            {isSuperAdmin && quote.permissions.canReject && (
                <Button
                    type="button"
                    variant="danger"
                    isLoading={actions.isSaving}
                    onClick={() => {
                        void actions.reject();
                    }}
                >
                    Rechazar
                </Button>
            )}

            <Button
                type="button"
                variant="secondary"
                onClick={onReload}
            >
                Actualizar
            </Button>
        </div>
    );
}
