import { db } from "../../database/db.js";
import { toCategory, type CategoryRow } from "./categories.mapper.js";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "./categories.types.js";

const categoryColumns = `
    id,
    name,
    slug,
    description,
    is_active,
    created_at,
    updated_at
`;

export async function findAll(activeOnly = false): Promise<Category[]> {
    const result = await db.query<CategoryRow>(`
        SELECT ${categoryColumns}
        FROM categories
        ${activeOnly ? "WHERE is_active = TRUE" : ""}
        ORDER BY name ASC, id ASC
    `);
    return result.rows.map(toCategory);
}

export async function findById(id: number, activeOnly = false): Promise<Category | null> {
    const result = await db.query<CategoryRow>(`
        SELECT ${categoryColumns}
        FROM categories
        WHERE id = $1
          ${activeOnly ? "AND is_active = TRUE" : ""}
        LIMIT 1
    `, [id]);
    return result.rows[0] ? toCategory(result.rows[0]) : null;
}

export async function hasProducts(categoryId: number): Promise<boolean> {
    const result = await db.query(`
        SELECT 1
        FROM products
        WHERE category_id = $1
        LIMIT 1
    `, [categoryId]);
    return result.rowCount > 0;
}

export async function create(input: CreateCategoryInput): Promise<Category> {
    const result = await db.query(`
        INSERT INTO categories (name, slug, description, is_active)
        VALUES ($1, $2, $3, $4)
    `, [input.name, input.slug, input.description ?? null, input.isActive ?? true]);
    const created = await findById(result.insertId);
    if (!created) throw new Error("No se pudo recuperar la categoría creada.");
    return created;
}

export async function update(id: number, input: UpdateCategoryInput): Promise<Category | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    const addField = (column: string, value: unknown): void => {
        values.push(value);
        fields.push(`${column} = $${values.length}`);
    };

    if (input.name !== undefined) addField("name", input.name);
    if (input.slug !== undefined) addField("slug", input.slug);
    if (input.description !== undefined) addField("description", input.description);
    if (input.isActive !== undefined) addField("is_active", input.isActive);
    if (fields.length === 0) return findById(id);

    fields.push("updated_at = CURRENT_TIMESTAMP");
    values.push(id);
    const result = await db.query(`
        UPDATE categories
        SET ${fields.join(", ")}
        WHERE id = $${values.length}
    `, values);
    if (result.rowCount === 0) return null;
    return findById(id);
}

export async function deactivate(id: number): Promise<Category | null> {
    const result = await db.query(`
        UPDATE categories
        SET is_active = FALSE,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND is_active = TRUE
    `, [id]);
    if (result.rowCount === 0) return null;
    return findById(id);
}
