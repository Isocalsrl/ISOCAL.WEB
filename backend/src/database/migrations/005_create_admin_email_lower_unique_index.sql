CREATE UNIQUE INDEX IF NOT EXISTS admins_email_lower_unique_idx
    ON admins (LOWER(email));
