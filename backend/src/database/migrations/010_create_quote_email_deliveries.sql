CREATE TABLE quote_email_deliveries (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    quote_id BIGINT NOT NULL,
    document_file_id BIGINT NOT NULL,
    attempt_type VARCHAR(20) NOT NULL,
    recipient_email VARCHAR(254) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_message_id VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    idempotency_key VARCHAR(255) NOT NULL,
    error_code VARCHAR(120),
    error_message VARCHAR(1000),
    requested_by INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMPTZ,

    CONSTRAINT quote_email_deliveries_quote_fk FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    CONSTRAINT quote_email_deliveries_document_fk FOREIGN KEY (document_file_id) REFERENCES stored_files(id) ON DELETE RESTRICT,
    CONSTRAINT quote_email_deliveries_requested_by_fk FOREIGN KEY (requested_by) REFERENCES admins(id) ON DELETE SET NULL,
    CONSTRAINT quote_email_deliveries_attempt_type_valid CHECK (attempt_type IN ('send', 'resend')),
    CONSTRAINT quote_email_deliveries_status_valid CHECK (status IN ('pending', 'sent', 'failed')),
    CONSTRAINT quote_email_deliveries_idempotency_unique UNIQUE (idempotency_key)
);

CREATE UNIQUE INDEX quote_email_initial_delivery_unique
    ON quote_email_deliveries (document_file_id)
    WHERE attempt_type = 'send';

CREATE INDEX quote_email_deliveries_quote_created_at_idx
    ON quote_email_deliveries (quote_id, created_at DESC);

ALTER TABLE quote_events
    DROP CONSTRAINT quote_events_type_valid;

ALTER TABLE quote_events
    ADD CONSTRAINT quote_events_type_valid CHECK (event_type IN (
        'review_started', 'pricing_updated', 'commercial_details_updated', 'prepared', 'rejected',
        'document_generated', 'email_sent', 'email_failed', 'email_resent'
    ));
