import type {
    Request,
    Response,
} from "express";

import {
    sendSuccess,
} from "../../shared/http/apiResponse.js";

import {
    parsePositiveInt,
} from "../../shared/utils/parsePositiveInt.js";

import * as categoriesService from "./services/categories.service.js";

import type {
    CreateCategoryInput,
    UpdateCategoryInput,
} from "./categories.types.js";

export async function listCategories(
    _req: Request,
    res: Response,
): Promise<void> {
    const categories =
        await categoriesService
            .getCategories();

    sendSuccess(
        res,
        categories,
    );
}

export async function listAdminCategories(
    req: Request,
    res: Response,
): Promise<void> {
    const categories =
        await categoriesService
            .getAdminCategories(
                req.admin!.role,
            );

    sendSuccess(res, categories);
}

export async function getCategoryById(
    req: Request,
    res: Response,
): Promise<void> {
    const id =
        parsePositiveInt(
            req.params.id,
        );

    const category =
        await categoriesService
            .getCategoryById(id);

    sendSuccess(
        res,
        category,
    );
}

export async function getAdminCategoryById(
    req: Request,
    res: Response,
): Promise<void> {
    const id = parsePositiveInt(
        req.params.id,
    );

    const category =
        await categoriesService
            .getAdminCategoryById(
                id,
                req.admin!.role,
            );

    sendSuccess(res, category);
}


export async function listCategoryProducts(
    req: Request,
    res: Response,
): Promise<void> {
    const id =
        parsePositiveInt(
            req.params.id,
        );

    const products =
        await categoriesService
            .getCategoryProducts(id);

    sendSuccess(
        res,
        products,
    );
}

export async function createCategory(
    req: Request,
    res: Response,
): Promise<void> {
    const input =
        req.body as CreateCategoryInput;

    const category =
        await categoriesService
            .createCategory(
                input,
                req.admin!.role,
            );

    sendSuccess(
        res,
        category,
        201,
    );
}

export async function updateCategory(
    req: Request,
    res: Response,
): Promise<void> {
    const id =
        parsePositiveInt(
            req.params.id,
        );

    const input =
        req.body as UpdateCategoryInput;

    const category =
        await categoriesService
            .updateCategory(
                id,
                input,
                req.admin!.role,
            );

    sendSuccess(
        res,
        category,
    );
}

export async function deactivateCategory(
    req: Request,
    res: Response,
): Promise<void> {
    const id =
        parsePositiveInt(
            req.params.id,
        );

    const category =
        await categoriesService
            .deactivateCategory(id);

    sendSuccess(
        res,
        category,
    );
}
