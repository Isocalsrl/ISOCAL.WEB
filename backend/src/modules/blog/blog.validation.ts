import { AppError } from '../../shared/errors/AppError.js';
import type { BlogInput, BlogQuery, BlogStatus } from './blog.types.js';
const statuses: readonly string[] = ['draft', 'published', 'archived'];
const fields = new Set(['title', 'slug', 'excerpt', 'content', 'topic', 'authorName', 'status', 'seoTitle', 'seoDescription', 'coverAlt', 'version']);
function invalid(message: string): never {
    throw new AppError(400, message, 'BLOG_VALIDATION_ERROR');
}
export function parseBlogVersion(value: unknown): number {
    if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1)
        invalid('La versión del artículo no es válida.');
    return value;
}
export function parseBlogInput(value: unknown): BlogInput {
    if (!value || typeof value !== 'object' || Array.isArray(value))
        invalid('El artículo debe ser un objeto.');
    const body = value as Record<string, unknown>;
    if (Object.keys(body).some(key => !fields.has(key)))
        invalid('El artículo contiene campos no permitidos.');
    const text = (key: string, max: number, required = false, fallback = '') => {
        const input = body[key] ?? fallback;
        if (typeof input !== 'string' || input.length > max || (required && !input.trim()))
            invalid(`Revisa el campo ${key} (máximo ${max} caracteres).`);
        return input.trim();
    };
    const status = body.status ?? 'draft';
    if (typeof status !== 'string' || !statuses.includes(status))
        invalid('El estado del artículo no es válido.');
    const input: BlogInput = {
        title: text('title', 180, true),
        slug: text('slug', 160, true),
        excerpt: text('excerpt', 400),
        content: text('content', 100000),
        topic: text('topic', 80, true, 'Metrología'),
        authorName: text('authorName', 120, true, 'Equipo ISOCAL'),
        status: status as BlogStatus,
        seoTitle: text('seoTitle', 180),
        seoDescription: text('seoDescription', 300),
        coverAlt: text('coverAlt', 250),
    };
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(input.slug))
        invalid('La URL solo admite letras minúsculas sin tildes, números y guiones.');
    if (input.status === 'published' && (!input.excerpt || !input.content))
        invalid('Completa el resumen y el contenido antes de publicar.');
    return input;
}
export function parseBlogQuery(value: Record<string, unknown>, admin = false): BlogQuery {
    const integer = (key: string, fallback: number, max: number) => {
        if (value[key] === undefined)
            return fallback;
        if (typeof value[key] !== 'string' || !/^\d+$/.test(value[key]))
            invalid(`El parámetro ${key} no es válido.`);
        const parsed = Number(value[key]);
        if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > max)
            invalid(`El parámetro ${key} está fuera de rango.`);
        return parsed;
    };
    const text = (key: string, max: number) => {
        if (value[key] === undefined)
            return '';
        if (typeof value[key] !== 'string' || value[key].length > max)
            invalid(`El parámetro ${key} no es válido.`);
        return value[key].trim();
    };
    const status = text('status', 20);
    if (admin && status && !statuses.includes(status))
        invalid('El filtro de estado no es válido.');
    return {
        page: integer('page', 1, 100000), pageSize: integer('pageSize', 12, 50),
        query: text('q', 160), topic: text('topic', 80),
        ...(admin ? status ? { status: status as BlogStatus } : {} : { status: 'published' as const }),
    };
}
