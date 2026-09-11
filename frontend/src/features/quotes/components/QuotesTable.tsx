import { Link } from "react-router-dom";
import { formatDate } from "../model/quoteFormatting";
import type { QuoteListItem } from "../types/quote.types";
import { QuoteStatusBadge } from "./QuoteStatusBadge";
export function QuotesTable({ quotes }: { quotes: readonly QuoteListItem[] }) { return <div className="quotes-table-wrap"><table className="quotes-table"><thead><tr><th>Referencia</th><th>Cliente</th><th>Estado</th><th>Productos</th><th>Registrada</th><th /></tr></thead><tbody>{quotes.map((quote) => <tr key={quote.id}><td><strong>{quote.reference}</strong></td><td>{quote.customer.name}<small>{quote.customer.email}</small></td><td><QuoteStatusBadge status={quote.status} /></td><td>{quote.itemCount}</td><td>{formatDate(quote.createdAt)}</td><td><Link className="ui-button ui-button-secondary" to={`/admin/quotes/${quote.id}`}>Ver</Link></td></tr>)}</tbody></table></div>; }
