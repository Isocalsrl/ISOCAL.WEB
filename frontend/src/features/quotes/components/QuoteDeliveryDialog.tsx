import { ConfirmDialog } from "../../../shared/components/ui/ConfirmDialog";
import type { QuoteActionsState } from "../hooks/useQuoteActions";
import type { QuoteDetail } from "../types/quote.types";

interface QuoteDeliveryDialogProps {
    quote: QuoteDetail;
    actions: QuoteActionsState;
}

export function QuoteDeliveryDialog({
    quote,
    actions,
}: QuoteDeliveryDialogProps) {
    const isResend = actions.deliveryAction === "resend";

    return (
        <ConfirmDialog
            isOpen={actions.deliveryAction !== null}
            title={isResend ? "Reenviar cotización" : "Enviar cotización"}
            description={
                isResend
                    ? `Se reenviará ${quote.reference} al correo registrado del cliente: ${quote.customer.email}. Se utilizará el PDF ya preparado.`
                    : `Se enviará ${quote.reference} al correo registrado del cliente: ${quote.customer.email}.`
            }
            confirmLabel={isResend ? "Reenviar" : "Enviar cotización"}
            isConfirming={actions.isSaving}
            onCancel={actions.cancelDelivery}
            onConfirm={() => {
                void actions.confirmDelivery();
            }}
        />
    );
}
