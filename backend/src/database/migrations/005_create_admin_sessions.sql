CREATE TABLE admin_sessions (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    token_hash CHAR(64) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT admin_sessions_admin_fk FOREIGN KEY (admin_id)
        REFERENCES admins(id)
        ON DELETE CASCADE,
    CONSTRAINT admin_sessions_token_hash_unique UNIQUE (token_hash),
    CONSTRAINT admin_sessions_expiration_valid CHECK (expires_at > created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX admin_sessions_expires_at_idx ON admin_sessions (expires_at);
