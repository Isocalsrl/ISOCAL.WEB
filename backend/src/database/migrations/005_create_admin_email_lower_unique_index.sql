CREATE UNIQUE INDEX admins_email_lower_unique_idx
    ON admins (LOWER(email));
