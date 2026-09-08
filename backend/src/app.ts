import express from "express";
import cors from "cors";
import { db } from "./database/db.js";

const app = express();

app.use(cors())
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
        })
    }
});

export default app