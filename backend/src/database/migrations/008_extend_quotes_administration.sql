ALTER TABLE quotes
    ADD COLUMN subtotal NUMERIC(12, 2),
    ADD COLUMN discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    ADD COLUMN tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 18.00,
    ADD COLUMN tax_amount NUMERIC(12, 2),
    ADD COLUMN total NUMERIC(12, 2),
    ADD COLUMN currency CHAR(3) NOT NULL DEFAULT 'PEN',
    ADD COLUMN valid_until DATE,
    ADD COLUMN payment_terms VARCHAR(500),
    ADD COLUMN commercial_notes VARCHAR(1500),
    ADD COLUMN internal_notes VARCHAR(1500),
    ADD COLUMN priced_by INTEGER,
    ADD COLUMN priced_at TIMESTAMPTZ,
    ADD COLUMN sent_at TIMESTAMPTZ;

ALTER TABLE quotes
    ADD CONSTRAINT quotes_subtotal_non_negative CHECK (subtotal IS NULL OR subtotal >= 0),
    ADD CONSTRAINT quotes_discount_amount_non_negative CHECK (discount_amount >= 0),
    ADD CONSTRAINT quotes_tax_rate_valid CHECK (tax_rate >= 0 AND tax_rate <= 100),
    ADD CONSTRAINT quotes_tax_amount_non_negative CHECK (tax_amount IS NULL OR tax_amount >= 0),
    ADD CONSTRAINT quotes_total_non_negative CHECK (total IS NULL OR total >= 0),
    ADD CONSTRAINT quotes_currency_not_empty CHECK (LENGTH(TRIM(currency)) = 3),
    ADD CONSTRAINT quotes_priced_by_fk FOREIGN KEY (priced_by) REFERENCES admins(id) ON DELETE SET NULL;

ALTER TABLE quote_items
    ADD COLUMN unit_price NUMERIC(12, 2),
    ADD COLUMN discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    ADD COLUMN subtotal NUMERIC(12, 2);

ALTER TABLE quote_items
    ADD CONSTRAINT quote_items_unit_price_non_negative CHECK (unit_price IS NULL OR unit_price >= 0),
    ADD CONSTRAINT quote_items_discount_amount_non_negative CHECK (discount_amount >= 0),
    ADD CONSTRAINT quote_items_subtotal_non_negative CHECK (subtotal IS NULL OR subtotal >= 0);

CREATE TABLE quote_events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    quote_id BIGINT NOT NULL,
    actor_admin_id INTEGER,
    event_type VARCHAR(40) NOT NULL,
    from_status VARCHAR(30),
    to_status VARCHAR(30),
    note VARCHAR(1000),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT quote_events_quote_fk FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    CONSTRAINT quote_events_actor_admin_fk FOREIGN KEY (actor_admin_id) REFERENCES admins(id) ON DELETE SET NULL,
    CONSTRAINT quote_events_type_valid CHECK (event_type IN (
        'review_started', 'pricing_updated', 'commercial_details_updated', 'prepared', 'rejected'
    ))
);

CREATE INDEX quote_events_quote_id_created_at_idx ON quote_events (quote_id, created_at DESC);
CREATE INDEX quotes_created_at_idx ON quotes (created_at DESC);
