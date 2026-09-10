import { Router, type RequestHandler } from "express";
import { validateBody } from "../../middlewares/validate.middleware.js";
import * as productsController from "./products.controller.js";
import {
    validateCreateProductBody,
    validateUpdateProductBody,
} from "./validators/products.body.validator.js";

export const productsRouter = Router();

productsRouter.get("/", productsController.listProducts);
productsRouter.get("/:id", productsController.getProductById);

export function createAdminProductsRouter(
    authenticateAdmin: RequestHandler,
): Router {
    const router = Router();

    router.use(authenticateAdmin);

    router.get(
        "/",
        productsController.listAdminProducts,
    );

    router.get(
        "/:id",
        productsController.getAdminProductById,
    );

    router.post(
        "/",
        validateBody(validateCreateProductBody),
        productsController.createProduct,
    );

    router.patch(
        "/:id",
        validateBody(validateUpdateProductBody),
        productsController.updateProduct,
    );

    router.delete("/:id", productsController.deactivateProduct);

    return router;
}
