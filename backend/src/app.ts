import cors from "cors";
import express from "express";
import { db } from "./database/db.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { productsRouter } from "./modules/products/products.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
    try {
        await db.query("SELECT 1");

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
});

app.use("/api/products", productsRouter);

app.use(errorMiddleware);

export default app;
