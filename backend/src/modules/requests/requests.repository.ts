import { db } from '../../database/db.js';
export async function findRequestedProducts(ids: number[]) {
    if (!ids.length)
        return [];
    const result = await db.query<{
        id: number;
        name: string;
    }>('SELECT id, name FROM products WHERE id = ANY($1::int[]) AND is_active = TRUE', [ids]);
    return result.rows;
}
