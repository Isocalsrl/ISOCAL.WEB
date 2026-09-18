import { Router, type RequestHandler } from "express";
import * as controller from "./blog.controller.js";
import {
    uploadBlogContentImage,
    uploadBlogCover,
} from "./blogImageUpload.middleware.js";

export const blogRouter = Router();

blogRouter.get("/topics", controller.topics);
blogRouter.get("/posts", controller.listPublic);
blogRouter.get("/posts/:id/cover", controller.cover(false));
blogRouter.get("/posts/:id/media/:assetName", controller.media);
blogRouter.get("/posts/:slug", controller.detailPublic);

export function createAdminBlogRouter(authenticate: RequestHandler): Router {
    const router = Router();
    router.use(authenticate);
    router.use((_req, res, next) => {
        res.setHeader("Cache-Control", "no-store");
        next();
    });

    router.get("/posts", controller.listAdmin);
    router.get("/posts/:id", controller.detailAdmin);
    router.post("/posts", controller.create);
    router.put("/posts/:id", controller.update);
    router.delete("/posts/:id", controller.archive);
    router.get("/posts/:id/cover", controller.cover(true));
    router.post("/posts/:id/cover", uploadBlogCover, controller.uploadCover);
    router.post("/posts/:id/media", uploadBlogContentImage, controller.uploadMedia);
    router.delete("/posts/:id/cover", controller.deleteCover);

    return router;
}
