import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/http/apiResponse.js";
import { parsePositiveInt } from "../../shared/utils/parsePositiveInt.js";
import * as service from "./products.service.js";
import type { CreateProductInput, UpdateProductInput } from "./products.types.js";
export async function listProducts(_req: Request, res: Response): Promise<void> {
    sendSuccess(res, await service.getProducts());
}
export async function listAdminProducts(req: Request, res: Response): Promise<void> {
    sendSuccess(res, await service.getAdminProducts(req.admin!.role));
}
export async function getProductById(req: Request, res: Response): Promise<void> {
    const id = parsePositiveInt(req.params.id);
    sendSuccess(res, await service.getProductById(id));
}
export async function getAdminProductById(req: Request, res: Response): Promise<void> {
    const id = parsePositiveInt(req.params.id);
    sendSuccess(res, await service.getAdminProductById(id, req.admin!.role));
}
export async function getProductImage(req: Request, res: Response): Promise<void> {
    const id = parsePositiveInt(req.params.id);
    const { image, content } = await service.getProductImage(id);
    const etag = `"${image.sha256}"`;
    if (req.headers["if-none-match"] === etag) {
        res.status(304).end();
        return;
    }
    const versioned = req.query.v === String(image.version);
    res.setHeader("Content-Type", image.mimeType);
    res.setHeader("Content-Length", content.byteLength.toString());
    res.setHeader("ETag", etag);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", versioned
        ? "public, max-age=31536000, immutable"
        : "public, max-age=0, must-revalidate");
    res.send(content);
}
export async function createProduct(req: Request, res: Response): Promise<void> {
    const input = req.body as CreateProductInput;
    const product = await service.createProduct(input, req.file, req.admin!);
    sendSuccess(res, product, 201);
}
export async function updateProduct(req: Request, res: Response): Promise<void> {
    const id = parsePositiveInt(req.params.id);
    const input = req.body as UpdateProductInput;
    sendSuccess(res, await service.updateProduct(id, input, req.file, req.admin!));
}
export async function deactivateProduct(req: Request, res: Response): Promise<void> {
    const id = parsePositiveInt(req.params.id);
    sendSuccess(res, await service.deactivateProduct(id));
}
