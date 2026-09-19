export interface ContactRequestInput {
    customer: {
        fullName: string;
        email: string;
        phone: string;
        companyName?: string | null;
        ruc?: string | null;
        jobTitle?: string | null;
        location?: string | null;
        notes?: string | null;
    };
    items: {
        productId: number;
        quantity: number;
        notes?: string | null;
    }[];
}
export interface ComplaintDetails {
    type: 'Reclamo' | 'Queja';
    document: string;
    address: string;
    product: string;
    amount: string;
    request: string;
    guardian?: string;
}
export interface RequestSubmission extends ContactRequestInput {
    kind: 'quotation' | 'contact' | 'complaint';
    consent: true;
    complaint?: ComplaintDetails;
    requestId?: string;
}
export interface RequestReceipt {
    reference: string;
    receipt: string;
    document?: {
        filename: string;
        contentBase64: string;
        mimeType: 'application/pdf';
    };
}
export interface RequestDocument {
    reference: string;
    createdAt: Date;
    customer: ContactRequestInput['customer'];
    items: {
        name: string;
        quantity: number;
        notes?: string | null;
    }[];
}
