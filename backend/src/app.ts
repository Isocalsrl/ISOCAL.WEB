import cors from "cors";
import express from "express";
import {
    env,
} from "./config/env.js";
import {
    db,
} from "./database/db.js";
import {
    authenticateAdmin,
} from "./middlewares/auth.middleware.js";
import {
    errorMiddleware,
} from "./middlewares/error.middleware.js";
import {
    authRouter,
} from "./modules/auth/auth.routes.js";
import {
    categoriesRouter,
    createAdminCategoriesRouter,
} from "./modules/categories/categories.routes.js";
import {
    createAdminProductsRouter,
    productsRouter,
} from "./modules/products/products.routes.js";

const app = express();

app.use(
    cors({
        origin:
            env.frontendOrigin,

        credentials: true,
    }),
);

app.use(
    express.json(),
);

app.get(
    "/health",
    async (_req, res) => {
        try {
            await db.query(
                "SELECT 1",
            );

            res.json({
                status: "ok",
                database: "connected",
            });
        } catch {
            res.status(503).json({
                status: "error",
                database: "disconnected",
            });
        }
    },
);

app.use(
    "/api/products",
    productsRouter,
);

app.use(
    "/api/categories",
    categoriesRouter,
);

app.use(
    "/api/admin/auth",
    authRouter,
);

app.use(
    "/api/admin/products",
    createAdminProductsRouter(
        authenticateAdmin,
    ),
);

app.use(
    "/api/admin/categories",
    createAdminCategoriesRouter(
        authenticateAdmin,
    ),
);

app.use(
    errorMiddleware,
);

export default app;
