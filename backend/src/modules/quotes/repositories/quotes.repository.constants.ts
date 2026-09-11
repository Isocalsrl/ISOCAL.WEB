export const QUOTE_COLUMNS = `
    id, reference, customer_name, customer_email, customer_phone,
    company_name, ruc, job_title, location, customer_notes, status,
    subtotal, discount_amount, tax_rate, tax_amount, total, currency,
    valid_until, payment_terms, commercial_notes, internal_notes,
    priced_by, priced_at, sent_at, created_at, updated_at
`;

export const QUOTE_ITEM_COLUMNS = `
    id, quote_id, product_id, product_name, quantity, customer_notes,
    unit_price, discount_amount, subtotal, created_at
`;
