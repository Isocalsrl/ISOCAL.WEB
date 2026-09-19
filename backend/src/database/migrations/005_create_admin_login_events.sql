CREATE TABLE admin_login_events (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    admin_id INT,
    attempted_email VARCHAR(225) NOT NULL,
    outcome VARCHAR(30) NOT NULL,
    ip_address VARCHAR(64),
    user_agent VARCHAR(512),
    occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_admin_login_events_admin FOREIGN KEY (admin_id)
        REFERENCES admins(id)
        ON DELETE SET NULL,
    CONSTRAINT chk_admin_login_events_email CHECK (LENGTH(TRIM(attempted_email)) > 0),
    CONSTRAINT chk_admin_login_events_outcome CHECK (
        outcome IN ('success', 'invalid_credentials', 'inactive_account')
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_admin_login_events_occurred_at ON admin_login_events(occurred_at DESC);
CREATE INDEX idx_admin_login_events_admin_id ON admin_login_events(admin_id);
