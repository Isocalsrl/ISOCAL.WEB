import { QUOTE_STATUS_LABELS } from "../model/quoteFormatting";
import type { QuoteStatus } from "../types/quote.types";
export function QuoteStatusBadge({ status }: { status: QuoteStatus }) { return <span className={`quote-status quote-status-${status}`}>{QUOTE_STATUS_LABELS[status]}</span>; }
