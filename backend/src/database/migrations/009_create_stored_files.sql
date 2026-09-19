CREATE TABLE stored_files (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    resource_type VARCHAR(40) NOT NULL,
    resource_id BIGINT NOT NULL,
    asset_role VARCHAR(40) NOT NULL,
    slot_key VARCHAR(80) NOT NULL DEFAULT 'default',
    version INT NOT NULL DEFAULT 1,
    storage_key VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    sha256 CHAR(64) NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    current_identity VARCHAR(220) GENERATED ALWAYS AS (
        CASE
            WHEN is_current = TRUE THEN CONCAT(resource_type, '|', resource_id, '|', asset_role, '|', slot_key)
            ELSE NULL
        END
    ) STORED,

    CONSTRAINT stored_files_resource_type_not_empty CHECK (LENGTH(TRIM(resource_type)) > 0),
    CONSTRAINT stored_files_asset_role_not_empty CHECK (LENGTH(TRIM(asset_role)) > 0),
    CONSTRAINT stored_files_resource_id_positive CHECK (resource_id > 0),
    CONSTRAINT stored_files_version_positive CHECK (version > 0),
    CONSTRAINT stored_files_file_size_positive CHECK (file_size_bytes > 0),
    CONSTRAINT stored_files_sha256_valid CHECK (sha256 REGEXP '^[a-f0-9]{64}$'),
    CONSTRAINT stored_files_storage_key_unique UNIQUE (storage_key),
    CONSTRAINT stored_files_created_by_fk FOREIGN KEY (created_by)
        REFERENCES admins(id)
        ON DELETE SET NULL,
    CONSTRAINT stored_files_resource_version_unique UNIQUE (resource_type, resource_id, asset_role, slot_key, version),
    CONSTRAINT stored_files_current_unique UNIQUE (current_identity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX stored_files_resource_created_at_idx
    ON stored_files (resource_type, resource_id, created_at DESC);
