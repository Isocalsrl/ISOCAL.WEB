import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/http/apiResponse.js";
import { parsePositiveInt } from "../../shared/utils/parsePositiveInt.js";
import * as productsService from "./services/products.service.js";
import type {
    CreateProductInput,
    UpdateProductInput,
} from "./products.types.js";

export async function listProducts(_req: Request, res: Response): Promise<void> {
    const products = await productsService.getProducts();

    sendSuccess(res, products);
}

export async function listAdminProducts(
    req: Request,
    res: Response,
): Promise<void> {
    const products =
        await productsService
            .getAdminProducts(
                req.admin!.role,
            );

    sendSuccess(res, products);
}

export async function getProductById(req: Request, res: Response): Promise<void> {
    const id = parsePositiveInt(req.params.id);
    const product = await productsService.getProductById(id);

    sendSuccess(res, product);
}

export async function getAdminProductById(
    req: Request,
    res: Response,
): Promise<void> {
    const id = parsePositiveInt(req.params.id);
    const product =
        await productsService
            .getAdminProductById(
                id,
                req.admin!.role,
            );

    sendSuccess(res, product);
}

export async function getProductImage(req: Request, res: Response): Promise<void> {
    const id = parsePositiveInt(req.params.id);
    const { image, content } = await productsService.getProductImage(id);
    const etag = `"${image.sha256}"`;
    if (req.headers["if-none-match"] === etag) {
        res.status(304).end();
        return;
    }
    res.setHeader("Content-Type", image.mimeType);
    res.setHeader("Content-Length", content.byteLength.toString());
    res.setHeader("ETag", etag);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", req.query.v === String(image.version) ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate");
    res.send(content);
}

export async function createProduct(req: Request, res: Response): Promise<void> {
    const input = req.body as CreateProductInput;
    const product = await productsService.createProduct(input, req.file, req.admin!);

    sendSuccess(res, product, 201);
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
    const id = parsePositiveInt(req.params.id);
    const input = req.body as UpdateProductInput;
    const product = await productsService.updateProduct(id, input, req.file, req.admin!);

    sendSuccess(res, product);
}

export async function deactivateProduct(req: Request, res: Response): Promise<void> {
    const id = parsePositiveInt(req.params.id);
    const product = await productsService.deactivateProduct(id);

    sendSuccess(res, product);
}
