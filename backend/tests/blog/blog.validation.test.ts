import { describe, expect, it } from 'vitest';
import { parseBlogInput, parseBlogQuery, parseBlogVersion } from '../../src/modules/blog/blog.validation.js';
import { blogDetail } from '../../src/modules/blog/blog.mapper.js';
import type { BlogRow } from '../../src/modules/blog/blog.types.js';
describe('contrato del blog', () => {
    it('permite borradores incompletos y exige contenido para publicar', () => {
        const input = { title: 'Mi artículo', slug: 'mi-articulo' };
        expect(parseBlogInput(input).status).toBe('draft');
        expect(() => parseBlogInput({ ...input, status: 'published' })).toThrow();
        expect(parseBlogInput({ ...input, status: 'published', excerpt: 'Resumen', content: 'Contenido' }).status).toBe('published');
    });
    it('rechaza URLs inseguras, contenido excesivo y campos no editables', () => {
        for (const slug of ['../admin', 'hola mundo', '<script>', 'áé', 'ABC'])
            expect(() => parseBlogInput({ title: 'Título', slug })).toThrow();
        expect(() => parseBlogInput({ title: 'Título', slug: 'titulo', content: 'a'.repeat(100001) })).toThrow();
        expect(() => parseBlogInput({ title: 'Título', slug: 'titulo', created_by: 1 })).toThrow();
    });
    it('nunca permite consultar borradores con parámetros públicos', () => {
        expect(parseBlogQuery({ status: 'draft' }).status).toBe('published');
        expect(parseBlogQuery({ status: 'draft' }, true).status).toBe('draft');
        for (const query of [{ page: '0' }, { page: '1.5' }, { pageSize: '100' }, { q: ['x'] }])
            expect(() => parseBlogQuery(query)).toThrow();
        expect(() => parseBlogVersion('1')).toThrow();
    });
    it('no expone claves de almacenamiento ni datos internos en público', () => {
        const row = { id: 4, title: 'Título', slug: 'titulo', content: 'Texto', cover_key: 'private/key', version: 2, status: 'published' } as BlogRow;
        const result = blogDetail(row);
        expect(result).not.toHaveProperty('cover_key');
        expect(result).not.toHaveProperty('version');
        expect(result.coverUrl).toBe('/api/blog/posts/4/cover?v=2');
    });
});
