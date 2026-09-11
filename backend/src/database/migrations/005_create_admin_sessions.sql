CREATE TABLE admin_sessions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    admin_id INTEGER NOT NULL,
    token_hash CHAR(64) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT admin_sessions_admin_fk
        FOREIGN KEY (admin_id)
        REFERENCES admins(id)
        ON DELETE CASCADE,

    CONSTRAINT admin_sessions_token_hash_unique
        UNIQUE (token_hash),

    CONSTRAINT admin_sessions_expiration_valid
        CHECK (expires_at > created_at)
);

CREATE INDEX admin_sessions_expires_at_idx
    ON admin_sessions (expires_at);
