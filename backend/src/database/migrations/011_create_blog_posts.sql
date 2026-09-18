CREATE TABLE blog_posts (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug VARCHAR(160) NOT NULL UNIQUE,
    title VARCHAR(180) NOT NULL,
    excerpt VARCHAR(400) NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    topic VARCHAR(80) NOT NULL DEFAULT 'Metrología',
    author_name VARCHAR(120) NOT NULL DEFAULT 'Equipo ISOCAL',
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    seo_title VARCHAR(180) NOT NULL DEFAULT '',
    seo_description VARCHAR(300) NOT NULL DEFAULT '',
    cover_key VARCHAR(500),
    cover_mime VARCHAR(30),
    cover_hash CHAR(64),
    cover_alt VARCHAR(250) NOT NULL DEFAULT '',
    version INTEGER NOT NULL DEFAULT 1,
    created_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    updated_by INTEGER REFERENCES admins(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMPTZ,
    CONSTRAINT blog_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    CONSTRAINT blog_title_not_empty CHECK (length(trim(title)) > 0),
    CONSTRAINT blog_status_valid CHECK (status IN ('draft', 'published', 'archived')),
    CONSTRAINT blog_version_positive CHECK (version > 0),
    CONSTRAINT blog_content_length CHECK (length(content) <= 100000),
    CONSTRAINT blog_published_complete CHECK (
        status <> 'published' OR
        (length(trim(excerpt)) > 0 AND length(trim(content)) > 0 AND published_at IS NOT NULL)
    )
);

CREATE INDEX blog_posts_public_order_idx ON blog_posts (published_at DESC, id DESC)
    WHERE status = 'published';
CREATE INDEX blog_posts_admin_order_idx ON blog_posts (updated_at DESC, id DESC);
CREATE INDEX blog_posts_search_idx ON blog_posts USING GIN (
    to_tsvector('spanish', title || ' ' || excerpt || ' ' || topic || ' ' || content)
);
