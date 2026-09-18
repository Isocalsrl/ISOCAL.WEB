import { basename } from 'node:path';
import { AppError } from '../../shared/errors/AppError.js';
import { binaryStorage } from '../../shared/storage/storageService.js';
import { buildStorageKey } from '../../shared/storage/providers/localFileStorage.provider.js';
import { detectImageFormat } from '../../shared/storage/imageFormat.js';
import * as repository from './blog.repository.js';
import { blogDetail, blogSummary } from './blog.mapper.js';
import type { BlogInput, BlogQuery, BlogRow } from './blog.types.js';
export { listTopics } from './blog.repository.js';
function missing(): never { throw new AppError(404, 'El artículo no está disponible.', 'BLOG_NOT_FOUND'); }
function conflict(): never { throw new AppError(409, 'Este artículo cambió en otra sesión. Recarga antes de guardar para no sobrescribir cambios.', 'BLOG_VERSION_CONFLICT'); }
async function requirePost(id: number, version?: number): Promise<BlogRow> {
    const row = await repository.findById(id);
    if (!row)
        missing();
    if (version !== undefined && row.version !== version)
        conflict();
    return row;
}
export async function listPosts(query: BlogQuery, admin = false) {
    const result = await repository.listPosts(query);
    return { items: result.items.map(row => blogSummary(row, admin)), total: result.total,
        page: query.page, pageSize: query.pageSize, totalPages: Math.ceil(result.total / query.pageSize) };
}
export async function getPublished(slug: string) {
    const row = await repository.findPublishedBySlug(slug);
    if (!row)
        missing();
    return blogDetail(row);
}
export async function getAdmin(id: number) { return blogDetail(await requirePost(id), true); }
async function uniqueSlug<T>(operation: () => Promise<T>): Promise<T> {
    try {
        return await operation();
    }
    catch (error) {
        if (typeof error === 'object' && error !== null && 'constraint' in error && error.constraint === 'blog_posts_slug_key') {
            throw new AppError(409, 'Ya existe un artículo con esta URL. Elige otra.', 'BLOG_SLUG_CONFLICT');
        }
        throw error;
    }
}
export async function createPost(input: BlogInput, adminId: number) {
    return blogDetail(await uniqueSlug(() => repository.createPost(input, adminId)), true);
}
export async function updatePost(id: number, version: number, input: BlogInput, adminId: number) {
    const previous = await requirePost(id, version);
    if (previous.cover_key && !input.coverAlt)
        throw new AppError(400, 'Describe la imagen de portada.', 'BLOG_COVER_ALT_REQUIRED');
    const row = await uniqueSlug(() => repository.updatePost(id, version, input, adminId));
    if (!row)
        conflict();
    return blogDetail(row, true);
}
export async function archivePost(id: number, version: number, adminId: number) {
    await requirePost(id, version);
    const row = await repository.archivePost(id, version, adminId);
    if (!row)
        conflict();
    return blogDetail(row, true);
}
async function removeOldCover(key: string | null) {
    if (!key)
        return;
    await binaryStorage.delete(key).catch(() => console.error('No se pudo eliminar una portada reemplazada del blog.'));
}
export async function uploadCover(id: number, version: number, file: Express.Multer.File | undefined, alt: unknown, adminId: number) {
    const previous = await requirePost(id, version);
    if (!file || file.buffer.length === 0)
        throw new AppError(400, 'Selecciona una imagen de portada.', 'BLOG_COVER_REQUIRED');
    if (file.buffer.length > 5 * 1024 * 1024)
        throw new AppError(413, 'La portada no puede superar los 5 MB.', 'BLOG_COVER_TOO_LARGE');
    if (typeof alt !== 'string' || !alt.trim() || alt.length > 250)
        throw new AppError(400, 'Describe la imagen en un máximo de 250 caracteres.', 'BLOG_COVER_ALT_REQUIRED');
    const format = detectImageFormat(file.buffer);
    if (!format || format.mimeType !== file.mimetype)
        throw new AppError(415, 'La portada debe ser una imagen JPG, PNG o WEBP válida.', 'BLOG_COVER_FORMAT');
    const key = buildStorageKey({ resourceType: 'blog', resourceId: id, assetRole: 'cover', extension: format.extension });
    const saved = await binaryStorage.save({ key, content: file.buffer });
    let row: BlogRow;
    try {
        const updated = await repository.setCover(id, version, { key, mime: format.mimeType, hash: saved.sha256, alt: alt.trim() }, adminId);
        if (!updated)
            conflict();
        row = updated;
    }
    catch (error) {
        await removeOldCover(key);
        throw error;
    }
    await removeOldCover(previous.cover_key);
    return blogDetail(row, true);
}

export async function uploadContentImage(id: number, file: Express.Multer.File | undefined) {
    await requirePost(id);
    if (!file || file.buffer.length === 0)
        throw new AppError(400, 'Selecciona una imagen.', 'BLOG_IMAGE_REQUIRED');
    if (file.buffer.length > 5 * 1024 * 1024)
        throw new AppError(413, 'La imagen no puede superar los 5 MB.', 'BLOG_IMAGE_TOO_LARGE');
    const format = detectImageFormat(file.buffer);
    if (!format || format.mimeType !== file.mimetype)
        throw new AppError(415, 'La imagen debe ser JPG, PNG o WEBP.', 'BLOG_IMAGE_FORMAT');
    const key = buildStorageKey({ resourceType: 'blog', resourceId: id, assetRole: 'content', extension: format.extension });
    await binaryStorage.save({ key, content: file.buffer });
    return { url: `/api/blog/posts/${id}/media/${basename(key)}` };
}
export async function getContentImage(id: number, assetName: string) {
    await requirePost(id);
    if (!/^[0-9a-f-]{36}\.(?:jpg|png|webp)$/i.test(assetName))
        throw new AppError(404, 'La imagen no está disponible.', 'BLOG_IMAGE_NOT_FOUND');
    const key = `blog/${id}/content/${assetName}`;
    try {
        const content = await binaryStorage.read(key);
        const format = detectImageFormat(content);
        if (!format)
            throw new Error('Formato inválido');
        return { content, mime: format.mimeType };
    }
    catch {
        throw new AppError(404, 'La imagen no está disponible.', 'BLOG_IMAGE_NOT_FOUND');
    }
}

export async function deleteCover(id: number, version: number, adminId: number) {
    const previous = await requirePost(id, version);
    const row = await repository.setCover(id, version, null, adminId);
    if (!row)
        conflict();
    await removeOldCover(previous.cover_key);
    return blogDetail(row, true);
}
export async function getCover(id: number, admin = false) {
    const row = await requirePost(id);
    if ((!admin && row.status !== 'published') || !row.cover_key || !row.cover_mime)
        missing();
    try {
        return { content: await binaryStorage.read(row.cover_key), mime: row.cover_mime };
    }
    catch {
        throw new AppError(404, 'La portada no está disponible.', 'BLOG_COVER_NOT_FOUND');
    }
}
