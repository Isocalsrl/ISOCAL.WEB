export type RequestKind = 'quotation' | 'contact' | 'complaint';
export interface RequestItem { productId: number; quantity: number; notes?: string; }
export interface ComplaintDetails {
    type: string; document: string; address: string; product: string; amount: string; request: string; guardian: string;
}
export interface RequestSubmission {
    kind: RequestKind;
    consent: boolean;
    customer: { fullName: string; email: string; phone: string; companyName: string; ruc: string; location: string; notes: string };
    items: RequestItem[];
    complaint?: ComplaintDetails;
    requestId?: string;
}
export interface RequestReceipt {
    reference: string;
    receipt: string;
    document?: { filename: string; contentBase64: string; mimeType: 'application/pdf' };
}
export const formText = (data: FormData, key: string) => String(data.get(key) ?? '').trim();
export function readRequestCustomer(data: FormData): RequestSubmission['customer'] {
    return { fullName: formText(data, 'name'), email: formText(data, 'email'), phone: formText(data, 'phone'),
        companyName: formText(data, 'company'), ruc: formText(data, 'ruc'), location: formText(data, 'location'), notes: formText(data, 'notes') };
}
