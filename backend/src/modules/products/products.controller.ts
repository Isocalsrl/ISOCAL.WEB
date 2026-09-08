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

export async function getProductById(req: Request, res: Response): Promise<void> {
    const id = parsePositiveInt(req.params.id);
    const product = await productsService.getProductById(id);

    sendSuccess(res, product);
}

export async function createProduct(req: Request, res: Response): Promise<void> {
    const input = req.body as CreateProductInput;
    const product = await productsService.createProduct(input);

    sendSuccess(res, product, 201);
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
    const id = parsePositiveInt(req.params.id);
    const input = req.body as UpdateProductInput;
    const product = await productsService.updateProduct(id, input);

    sendSuccess(res, product);
}

export async function deactivateProduct(req: Request, res: Response): Promise<void> {
    const id = parsePositiveInt(req.params.id);
    const product = await productsService.deactivateProduct(id);

    sendSuccess(res, product);
}
