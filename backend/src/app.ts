import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { db } from "./database/db.js";
import { authenticateAdmin } from "./modules/auth/auth.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { categoriesRouter, createAdminCategoriesRouter } from "./modules/categories/categories.routes.js";
import { createAdminProductsRouter, productsRouter } from "./modules/products/products.routes.js";
import { requestsRouter } from "./modules/requests/requests.routes.js";
import { blogRouter, createAdminBlogRouter } from "./modules/blog/blog.routes.js";
const app = express();
app.disable("x-powered-by");
if (env.trustProxyHops > 0) {
    app.set("trust proxy", env.trustProxyHops);
}
app.use(cors({
    origin: env.frontendOrigins,
    credentials: true,
}));
app.use(express.json({ limit: '512kb' }));
app.get("/health", async (_req, res) => {
    try {
        await db.query("SELECT 1");
        res.json({
            status: "ok",
            database: "connected",
        });
    }
    catch {
        res.status(503).json({
            status: "error",
            database: "disconnected",
        });
    }
});
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/requests", requestsRouter);
app.use("/api/blog", blogRouter);
app.use("/api/admin/blog", createAdminBlogRouter(authenticateAdmin));
app.use("/api/admin/auth", authRouter);
app.use("/api/admin/products", createAdminProductsRouter(authenticateAdmin));
app.use("/api/admin/categories", createAdminCategoriesRouter(authenticateAdmin));
app.use("/api", (_req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: "ROUTE_NOT_FOUND",
            message: "La ruta solicitada no existe.",
        },
    });
});
app.use(errorMiddleware);
export default app;
