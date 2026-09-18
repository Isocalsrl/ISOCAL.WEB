import type { Request, Response } from "express";
import { sendSuccess } from "../../shared/http/apiResponse.js";
import { parsePositiveInt } from "../../shared/utils/parsePositiveInt.js";
import * as service from "./categories.service.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "./categories.types.js";
export async function listCategories(_req: Request, res: Response): Promise<void> {
    sendSuccess(res, await service.getCategories());
}
export async function listAdminCategories(req: Request, res: Response): Promise<void> {
    sendSuccess(res, await service.getAdminCategories(req.admin!.role));
}
export async function getCategoryById(req: Request, res: Response): Promise<void> {
    const id = parsePositiveInt(req.params.id);
    sendSuccess(res, await service.getCategoryById(id));
}
export async function getAdminCategoryById(req: Request, res: Response): Promise<void> {
    const id = parsePositiveInt(req.params.id);
    sendSuccess(res, await service.getAdminCategoryById(id, req.admin!.role));
}
export async function listCategoryProducts(req: Request, res: Response): Promise<void> {
    const id = parsePositiveInt(req.params.id);
    sendSuccess(res, await service.getCategoryProducts(id));
}
export async function createCategory(req: Request, res: Response): Promise<void> {
    const input = req.body as CreateCategoryInput;
    const category = await service.createCategory(input, req.admin!.role);
    sendSuccess(res, category, 201);
}
export async function updateCategory(req: Request, res: Response): Promise<void> {
    const id = parsePositiveInt(req.params.id);
    const input = req.body as UpdateCategoryInput;
    sendSuccess(res, await service.updateCategory(id, input, req.admin!.role));
}
export async function deactivateCategory(req: Request, res: Response): Promise<void> {
    const id = parsePositiveInt(req.params.id);
    sendSuccess(res, await service.deactivateCategory(id));
}
