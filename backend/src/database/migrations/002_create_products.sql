CREATE TABLE products (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(180) NOT NULL,
    description TEXT,
    category_id INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT products_name_not_empty
        CHECK (LENGTH(TRIM(name)) > 0),

    CONSTRAINT products_slug_not_empty
        CHECK (LENGTH(TRIM(slug)) > 0),
        
    CONSTRAINT products_slug_unique
        UNIQUE (slug),
    
    CONSTRAINT products_category_fk
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);
