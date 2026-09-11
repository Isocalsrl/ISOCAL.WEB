import { Router, type RequestHandler } from "express";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { normalizeProductMultipartBody, productImageUpload, requireProductImage, validateProductUpdateRequest } from "./middlewares/productImageUpload.middleware.js";
import * as productsController from "./products.controller.js";
import { validateCreateProductBody } from "./validators/products.body.validator.js";

export const productsRouter = Router();

productsRouter.get("/", productsController.listProducts);
productsRouter.get("/:id/image", productsController.getProductImage);
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

    router.post("/", productImageUpload.single("image"), normalizeProductMultipartBody, requireProductImage, validateBody(validateCreateProductBody), productsController.createProduct);

    router.patch("/:id", productImageUpload.single("image"), normalizeProductMultipartBody, validateProductUpdateRequest, productsController.updateProduct);

    router.delete("/:id", productsController.deactivateProduct);

    return router;
}
