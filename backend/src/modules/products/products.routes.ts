import { Router, type RequestHandler } from "express";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { normalizeProductMultipartBody, productImageUpload, requireProductImage, validateProductUpdateRequest } from "./productImageUpload.middleware.js";
import * as controller from "./products.controller.js";
import { validateCreateProductBody } from "./products.validation.js";
export const productsRouter = Router();
productsRouter.get("/", controller.listProducts);
productsRouter.get("/:id/image", controller.getProductImage);
productsRouter.get("/:id", controller.getProductById);
export function createAdminProductsRouter(authenticateAdmin: RequestHandler): Router {
    const router = Router();
    router.use(authenticateAdmin);
    router.get("/", controller.listAdminProducts);
    router.get("/:id", controller.getAdminProductById);
    router.post("/", productImageUpload.single("image"), normalizeProductMultipartBody, requireProductImage, validateBody(validateCreateProductBody), controller.createProduct);
    router.patch("/:id", productImageUpload.single("image"), normalizeProductMultipartBody, validateProductUpdateRequest, controller.updateProduct);
    router.delete("/:id", controller.deactivateProduct);
    return router;
}
