CREATE TABLE quote_email_deliveries (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP NULL DEFAULT NULL,

    CONSTRAINT quote_email_deliveries_quote_fk FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE,
    CONSTRAINT quote_email_deliveries_document_fk FOREIGN KEY (document_file_id) REFERENCES stored_files(id) ON DELETE RESTRICT,
    CONSTRAINT quote_email_deliveries_attempt_type_valid CHECK (attempt_type IN ('send')),
    CONSTRAINT quote_email_deliveries_status_valid CHECK (status IN ('pending', 'sent', 'failed')),
    CONSTRAINT quote_email_deliveries_idempotency_unique UNIQUE (idempotency_key),
    CONSTRAINT quote_email_initial_delivery_unique UNIQUE (document_file_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX quote_email_deliveries_quote_created_at_idx
    ON quote_email_deliveries (quote_id, created_at DESC);
