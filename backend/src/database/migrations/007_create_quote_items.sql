CREATE TABLE quote_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    quote_id BIGINT NOT NULL,
    product_id INTEGER NOT NULL,
    product_name VARCHAR(150) NOT NULL,
    quantity INTEGER NOT NULL,
    customer_notes VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT quote_items_quote_fk
        FOREIGN KEY (quote_id)
        REFERENCES quotes(id)
        ON DELETE CASCADE,

    CONSTRAINT quote_items_product_fk
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE RESTRICT,

    CONSTRAINT quote_items_product_name_not_empty
        CHECK (LENGTH(TRIM(product_name)) > 0),

    CONSTRAINT quote_items_quantity_valid
        CHECK (quantity BETWEEN 1 AND 999),

    CONSTRAINT quote_items_quote_product_unique
        UNIQUE (quote_id, product_id)
);


CREATE INDEX quote_items_quote_id_idx
    ON quote_items (quote_id);