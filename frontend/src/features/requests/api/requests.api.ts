import { request } from "../../../shared/api/httpClient";
import type { RequestReceipt, RequestSubmission } from '../model/request.types';

export function submitRequest(input: RequestSubmission) {
    return request<RequestReceipt>('/api/requests', { method: 'POST', body: JSON.stringify(input) });
}
