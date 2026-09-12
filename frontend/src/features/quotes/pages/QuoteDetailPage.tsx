import {
    Link,
    useParams,
} from "react-router-dom";

import {
    InlineAlert,
} from "../../../shared/components/feedback/InlineAlert";
import {
    useAuth,
} from "../../auth/hooks/useAuth";
import {
    QuoteCommercialSection,
} from "../components/QuoteCommercialSection";
import {
    QuoteCustomerPanel,
} from "../components/QuoteCustomerPanel";
import {
    QuoteDeliveryDialog,
} from "../components/QuoteDeliveryDialog";
import {
    QuoteDetailActions,
} from "../components/QuoteDetailActions";
import {
    QuoteDetailHeader,
} from "../components/QuoteDetailHeader";
import {
    QuoteItemsPanel,
} from "../components/QuoteItemsPanel";
import {
    useQuoteActions,
} from "../hooks/useQuoteActions";
import {
    useQuoteDetail,
} from "../hooks/useQuoteDetail";

import "../styles/quotes.css";

export function QuoteDetailPage() {
    const { quoteId } = useParams();
    const id = Number(quoteId);
    const { admin } = useAuth();
    const detail = useQuoteDetail(id);
    const actions = useQuoteActions({
        quoteId: id,
        setQuote: detail.setQuote,
    });

    if (!Number.isInteger(id) || id <= 0) {
        return (
            <div className="management-page">
                <InlineAlert>Cotización no válida.</InlineAlert>
            </div>
        );
    }

    if (detail.isLoading) {
        return (
            <div className="management-page">
                <p>Cargando cotización...</p>
            </div>
        );
    }

    if (detail.errorMessage || !detail.quote) {
        return (
            <div className="management-page">
                <InlineAlert>
                    {detail.errorMessage ?? "Cotización no encontrada."}
                </InlineAlert>
                <Link
                    className="ui-button ui-button-secondary"
                    to="/admin/quotes"
                >
                    Volver
                </Link>
            </div>
        );
    }

    const quote = detail.quote;
    const isSuperAdmin = admin?.role === "super_admin";

    return (
        <div className="management-page">
            <QuoteDetailHeader quote={quote} />

            {actions.actionError && (
                <InlineAlert>{actions.actionError}</InlineAlert>
            )}

            <QuoteDetailActions
                quote={quote}
                isSuperAdmin={isSuperAdmin}
                actions={actions}
                onReload={detail.reload}
            />

            <div className="quote-detail-grid">
                <QuoteCustomerPanel
                    customer={quote.customer}
                    notes={quote.customerNotes}
                />
                <QuoteItemsPanel
                    items={quote.items}
                    showPricing={isSuperAdmin}
                />
            </div>

            {isSuperAdmin && (
                <QuoteCommercialSection
                    quote={quote}
                    history={detail.history}
                    actions={actions}
                />
            )}

            <QuoteDeliveryDialog
                quote={quote}
                actions={actions}
            />
        </div>
    );
}
