export const PRODUCT_COLUMNS = `
    id,
    name,
    slug,
    description,
    category_id,
    is_active,
    created_at,
    updated_at
`;

export const PRODUCT_SELECT_COLUMNS = `
    p.id,
    p.name,
    p.slug,
    p.description,
    p.category_id,
    (
        SELECT sf.version
        FROM stored_files sf
        WHERE sf.resource_type = 'products'
            AND sf.resource_id = p.id
            AND sf.asset_role = 'image'
            AND sf.slot_key = 'primary'
            AND sf.is_current = TRUE
        LIMIT 1
    ) AS image_version,
    p.is_active,
    p.created_at,
    p.updated_at
`;
