import type { QuoteActionsState } from "../hooks/useQuoteActions";
import { formatMoney } from "../model/quoteFormatting";
import type {
    QuoteDetail,
    QuoteHistoryEvent,
} from "../types/quote.types";
import { QuoteCommercialEditor } from "./QuoteCommercialEditor";
import { QuoteHistory } from "./QuoteHistory";
import { QuotePricingEditor } from "./QuotePricingEditor";

interface QuoteCommercialSectionProps {
    quote: QuoteDetail;
    history: QuoteHistoryEvent[];
    actions: QuoteActionsState;
}

export function QuoteCommercialSection({
    quote,
    history,
    actions,
}: QuoteCommercialSectionProps) {
    if (!quote.commercial) {
        return null;
    }

    return (
        <>
            <QuotePricingEditor
                key={`pricing-${quote.updatedAt}`}
                items={quote.items}
                discountAmount={quote.commercial.discountAmount}
                taxRate={quote.commercial.taxRate}
                isSaving={actions.isSaving}
                onSave={async (input) => {
                    await actions.savePricing(input);
                }}
            />

            <QuoteCommercialEditor
                key={`commercial-${quote.updatedAt}`}
                commercial={quote.commercial}
                isSaving={actions.isSaving}
                onSave={async (input) => {
                    await actions.saveCommercialDetails(input);
                }}
            />

            <section className="quote-panel quote-totals">
                <h2>Resumen económico</h2>
                <p>
                    Subtotal: <strong>{formatMoney(quote.commercial.subtotal)}</strong>
                </p>
                <p>
                    Descuento:{" "}
                    <strong>{formatMoney(quote.commercial.discountAmount)}</strong>
                </p>
                <p>
                    Impuestos:{" "}
                    <strong>{formatMoney(quote.commercial.taxAmount)}</strong>
                </p>
                <p>
                    Total: <strong>{formatMoney(quote.commercial.total)}</strong>
                </p>
            </section>

            <QuoteHistory events={history} />
        </>
    );
}
