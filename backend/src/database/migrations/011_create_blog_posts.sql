CREATE TABLE blog_posts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(160) NOT NULL UNIQUE,
    title VARCHAR(180) NOT NULL,
    excerpt VARCHAR(400) NOT NULL DEFAULT '',
    content MEDIUMTEXT NOT NULL,
    topic VARCHAR(80) NOT NULL DEFAULT 'Metrología',
    author_name VARCHAR(120) NOT NULL DEFAULT 'Equipo ISOCAL',
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    seo_title VARCHAR(180) NOT NULL DEFAULT '',
    seo_description VARCHAR(300) NOT NULL DEFAULT '',
    cover_key VARCHAR(500),
    cover_mime VARCHAR(30),
    cover_hash CHAR(64),
    cover_alt VARCHAR(250) NOT NULL DEFAULT '',
    version INT NOT NULL DEFAULT 1,
    created_by INT,
    updated_by INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP NULL DEFAULT NULL,

    CONSTRAINT blog_created_by_fk FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL,
    CONSTRAINT blog_updated_by_fk FOREIGN KEY (updated_by) REFERENCES admins(id) ON DELETE SET NULL,
    CONSTRAINT blog_slug_format CHECK (slug REGEXP '^[a-z0-9]+(-[a-z0-9]+)*$'),
    CONSTRAINT blog_title_not_empty CHECK (LENGTH(TRIM(title)) > 0),
    CONSTRAINT blog_status_valid CHECK (status IN ('draft', 'published', 'archived')),
    CONSTRAINT blog_version_positive CHECK (version > 0),
    CONSTRAINT blog_content_length CHECK (CHAR_LENGTH(content) <= 100000),
    CONSTRAINT blog_published_complete CHECK (
        status <> 'published' OR
        (LENGTH(TRIM(excerpt)) > 0 AND LENGTH(TRIM(content)) > 0 AND published_at IS NOT NULL)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX blog_posts_public_order_idx ON blog_posts (status, published_at DESC, id DESC);
CREATE INDEX blog_posts_admin_order_idx ON blog_posts (updated_at DESC, id DESC);
CREATE INDEX blog_posts_topic_idx ON blog_posts (topic);
