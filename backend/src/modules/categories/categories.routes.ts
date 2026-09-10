import {
    Router,
    type RequestHandler,
} from "express";

import {
    validateBody,
} from "../../middlewares/validate.middleware.js";

import * as categoriesController from "./categories.controller.js";

import {
    validateCreateCategoryBody,
    validateUpdateCategoryBody,
} from "./validators/categories.body.validator.js";

export const categoriesRouter =
    Router();

categoriesRouter.get(
    "/",
    categoriesController.listCategories,
);

categoriesRouter.get(
    "/:id/products",
    categoriesController.listCategoryProducts,
);

categoriesRouter.get(
    "/:id",
    categoriesController.getCategoryById,
);

export function createAdminCategoriesRouter(
    authenticateAdmin: RequestHandler,
): Router {
    const router = Router();

    router.use(
        authenticateAdmin,
    );

    router.get(
        "/",
        categoriesController.listAdminCategories,
    );

    router.get(
        "/:id",
        categoriesController.getAdminCategoryById,
    );

    router.post(
        "/",
        validateBody(
            validateCreateCategoryBody,
        ),
        categoriesController.createCategory,
    );

    router.patch(
        "/:id",
        validateBody(
            validateUpdateCategoryBody,
        ),
        categoriesController.updateCategory,
    );

    router.delete(
        "/:id",
        categoriesController.deactivateCategory,
    );

    return router;
}
