import { Router, type RequestHandler } from "express";
import { validateBody } from "../../middlewares/validate.middleware.js";
import * as controller from "./categories.controller.js";
import { validateCreateCategoryBody, validateUpdateCategoryBody } from "./categories.validation.js";
export const categoriesRouter = Router();
categoriesRouter.get("/", controller.listCategories);
categoriesRouter.get("/:id/products", controller.listCategoryProducts);
categoriesRouter.get("/:id", controller.getCategoryById);
export function createAdminCategoriesRouter(authenticateAdmin: RequestHandler): Router {
    const router = Router();
    router.use(authenticateAdmin);
    router.get("/", controller.listAdminCategories);
    router.get("/:id", controller.getAdminCategoryById);
    router.post("/", validateBody(validateCreateCategoryBody), controller.createCategory);
    router.patch("/:id", validateBody(validateUpdateCategoryBody), controller.updateCategory);
    router.delete("/:id", controller.deactivateCategory);
    return router;
}
