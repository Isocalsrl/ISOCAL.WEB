CREATE TABLE admins (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(225) NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT admins_name_not_empty
        CHECK (LENGTH(TRIM(name)) > 0),
    
    CONSTRAINT admin_email_not_empty
        CHECK (LENGTH(TRIM(email)) > 0),

    CONSTRAINT admin_email_unique
        UNIQUE (email),

    CONSTRAINT admin_role_valid
        CHECK (role in ('admin', 'super_admin'))
);
