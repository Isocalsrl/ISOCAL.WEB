import type { QuoteDocumentData } from "../quoteDocument.types.js";
import { renderQuoteDocument } from "../templates/quoteDocument.template.js";
export function generateQuotePdf(data: QuoteDocumentData): Promise<Buffer> { return renderQuoteDocument(data); }
