CREATE TABLE stored_files (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    resource_type VARCHAR(40) NOT NULL,
    resource_id BIGINT NOT NULL,
    asset_role VARCHAR(40) NOT NULL,
    slot_key VARCHAR(80) NOT NULL DEFAULT 'default',

    version INTEGER NOT NULL DEFAULT 1,
    storage_key VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    sha256 CHAR(64) NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT TRUE,

    created_by INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT stored_files_resource_type_not_empty
        CHECK (LENGTH(TRIM(resource_type)) > 0),

    CONSTRAINT stored_files_asset_role_not_empty
        CHECK (LENGTH(TRIM(asset_role)) > 0),

    CONSTRAINT stored_files_resource_id_positive
        CHECK (resource_id > 0),

    CONSTRAINT stored_files_version_positive
        CHECK (version > 0),

    CONSTRAINT stored_files_file_size_positive
        CHECK (file_size_bytes > 0),

    CONSTRAINT stored_files_sha256_valid
        CHECK (sha256 ~ '^[a-f0-9]{64}$'),

    CONSTRAINT stored_files_storage_key_unique
        UNIQUE (storage_key),

    CONSTRAINT stored_files_created_by_fk
        FOREIGN KEY (created_by)
        REFERENCES admins(id)
        ON DELETE SET NULL,

    CONSTRAINT stored_files_resource_version_unique
        UNIQUE (resource_type, resource_id, asset_role, slot_key, version)
);

CREATE UNIQUE INDEX stored_files_current_unique
    ON stored_files (resource_type, resource_id, asset_role, slot_key)
    WHERE is_current = TRUE;

CREATE INDEX stored_files_resource_created_at_idx
    ON stored_files (resource_type, resource_id, created_at DESC);
