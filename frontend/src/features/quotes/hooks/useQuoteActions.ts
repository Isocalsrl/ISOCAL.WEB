import {
    useState,
} from "react";

import {
    ApiError,
} from "../../../shared/api/httpClient";

import {
    prepareQuote,
    rejectQuote,
    resendQuote,
    reviewQuote,
    sendQuote,
    updateCommercialDetails,
    updatePricing,
} from "../api/quotes.api";

import type {
    CommercialDetailsInput,
    PricingInput,
    QuoteDetail,
} from "../types/quote.types";

export type QuoteDeliveryAction = "send" | "resend";

interface UseQuoteActionsOptions {
    quoteId: number;
    setQuote: (quote: QuoteDetail) => void;
}

export function useQuoteActions({
    quoteId,
    setQuote,
}: UseQuoteActionsOptions) {
    const [actionError, setActionError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [deliveryAction, setDeliveryAction] =
        useState<QuoteDeliveryAction | null>(null);

    async function run(
        operation: () => Promise<QuoteDetail>,
    ): Promise<boolean> {
        setActionError(null);
        setIsSaving(true);

        try {
            setQuote(await operation());
            return true;
        } catch (error) {
            setActionError(
                error instanceof ApiError
                    ? error.message
                    : "No se pudo actualizar la cotización.",
            );
            return false;
        } finally {
            setIsSaving(false);
        }
    }

    return {
        actionError,
        isSaving,
        deliveryAction,
        startReview: () => run(() => reviewQuote(quoteId)),
        prepare: () => run(() => prepareQuote(quoteId)),
        reject: () =>
            run(() =>
                rejectQuote(
                    quoteId,
                    "Rechazada desde el panel administrativo",
                ),
            ),
        savePricing: (input: PricingInput) =>
            run(() => updatePricing(quoteId, input)),
        saveCommercialDetails: (input: CommercialDetailsInput) =>
            run(() => updateCommercialDetails(quoteId, input)),
        requestDelivery: (action: QuoteDeliveryAction) => {
            setDeliveryAction(action);
        },
        cancelDelivery: () => {
            setDeliveryAction(null);
        },
        confirmDelivery: async () => {
            if (!deliveryAction) {
                return;
            }

            await run(() =>
                deliveryAction === "send"
                    ? sendQuote(quoteId)
                    : resendQuote(quoteId),
            );
            setDeliveryAction(null);
        },
    };
}

export type QuoteActionsState = ReturnType<typeof useQuoteActions>;
