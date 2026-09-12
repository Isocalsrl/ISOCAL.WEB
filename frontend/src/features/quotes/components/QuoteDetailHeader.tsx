import { Link } from "react-router-dom";

import { formatDate } from "../model/quoteFormatting";
import type { QuoteDetail } from "../types/quote.types";
import { QuoteStatusBadge } from "./QuoteStatusBadge";

interface QuoteDetailHeaderProps {
    quote: QuoteDetail;
}

export function QuoteDetailHeader({ quote }: QuoteDetailHeaderProps) {
    return (
        <header className="quote-detail-header">
            <div>
                <Link to="/admin/quotes">← Cotizaciones</Link>
                <p className="eyebrow">Solicitud {quote.reference}</p>
                <h1>{quote.reference}</h1>
                <p>Registrada el {formatDate(quote.createdAt)}</p>
            </div>

            <QuoteStatusBadge status={quote.status} />
        </header>
    );
}
