import { request } from "../../../shared/api/httpClient";
import type {
    CreateQuoteRequestPayload,
    CreateQuoteRequestResponse,
} from "../types/quoteRequest.types";

export function createPublicQuote(
    payload: CreateQuoteRequestPayload,
): Promise<CreateQuoteRequestResponse> {
    return request<CreateQuoteRequestResponse>("/api/quotes", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
