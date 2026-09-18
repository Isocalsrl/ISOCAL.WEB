import type { Request, Response } from 'express';
import { sendSuccess } from '../../shared/http/apiResponse.js';
import { parsePositiveInt } from '../../shared/utils/parsePositiveInt.js';
import { parseBlogInput, parseBlogQuery, parseBlogVersion } from './blog.validation.js';
import * as service from './blog.service.js';
export async function listPublic(req: Request, res: Response) {
    res.setHeader('Cache-Control', 'no-store');
    sendSuccess(res, await service.listPosts(parseBlogQuery(req.query)));
}
export async function topics(_req: Request, res: Response) { sendSuccess(res, await service.listTopics()); }
export async function detailPublic(req: Request, res: Response) {
    res.setHeader('Cache-Control', 'no-store');
    sendSuccess(res, await service.getPublished(String(req.params.slug)));
}
export async function listAdmin(req: Request, res: Response) { sendSuccess(res, await service.listPosts(parseBlogQuery(req.query, true), true)); }
export async function detailAdmin(req: Request, res: Response) { sendSuccess(res, await service.getAdmin(parsePositiveInt(req.params.id))); }
export async function create(req: Request, res: Response) { sendSuccess(res, await service.createPost(parseBlogInput(req.body), req.admin!.id), 201); }
export async function update(req: Request, res: Response) {
    sendSuccess(res, await service.updatePost(parsePositiveInt(req.params.id), parseBlogVersion(req.body?.version), parseBlogInput(req.body), req.admin!.id));
}
export async function archive(req: Request, res: Response) {
    sendSuccess(res, await service.archivePost(parsePositiveInt(req.params.id), parseBlogVersion(req.body?.version), req.admin!.id));
}
export async function uploadCover(req: Request, res: Response) {
    sendSuccess(res, await service.uploadCover(parsePositiveInt(req.params.id), parseBlogVersion(Number(req.body?.version)), req.file, req.body?.alt, req.admin!.id));
}
export async function uploadMedia(req: Request, res: Response) {
    sendSuccess(res, await service.uploadContentImage(parsePositiveInt(req.params.id), req.file), 201);
}
export async function media(req: Request, res: Response) {
    const image = await service.getContentImage(parsePositiveInt(req.params.id), String(req.params.assetName));
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.type(image.mime).send(image.content);
}
export async function deleteCover(req: Request, res: Response) {
    sendSuccess(res, await service.deleteCover(parsePositiveInt(req.params.id), parseBlogVersion(req.body?.version), req.admin!.id));
}
export function cover(admin: boolean) {
    return async (req: Request, res: Response) => {
        const image = await service.getCover(parsePositiveInt(req.params.id), admin);
        res.setHeader('Cache-Control', 'no-store');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.type(image.mime).send(image.content);
    };
}
