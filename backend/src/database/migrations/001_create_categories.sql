CREATE TABLE categories (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT categories_name_not_empty
        CHECK (LENGTH(TRIM(name)) > 0),

    CONSTRAINT categories_slug_not_empty
        CHECK (LENGTH(TRIM(slug)) > 0),

    CONSTRAINT categories_name_unique
        UNIQUE (name),
    
    CONSTRAINT categories_slug_unique
        UNIQUE (slug)
);
