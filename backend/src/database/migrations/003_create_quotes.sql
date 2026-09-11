CREATE SEQUENCE quote_reference_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1;

CREATE TABLE quotes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    reference VARCHAR(32) NOT NULL,
    customer_name VARCHAR(120) NOT NULL,
    customer_email VARCHAR(254) NOT NULL,
    customer_phone VARCHAR(24) NOT NULL,
    company_name VARCHAR(160),
    ruc VARCHAR(11),
    job_title VARCHAR(120),
    location VARCHAR(120),
    customer_notes VARCHAR(1500),
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT quotes_reference_unique
        UNIQUE (reference),

    CONSTRAINT quotes_customer_name_not_empty
        CHECK (LENGTH(TRIM(customer_name)) > 0),

    CONSTRAINT quotes_customer_email_not_empty
        CHECK (LENGTH(TRIM(customer_email)) > 0),

    CONSTRAINT quotes_customer_phone_not_empty
        CHECK (LENGTH(TRIM(customer_phone)) > 0),

    CONSTRAINT quotes_ruc_valid
        CHECK (ruc IS NULL OR ruc ~ '^[0-9]{11}$'),

    CONSTRAINT quotes_status_valid
        CHECK (
            status IN (
                'pending',
                'in_review',
                'priced',
                'ready_to_send',
                'sent',
                'rejected'
            )
        )
);