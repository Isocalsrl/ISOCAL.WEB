import type { NextFunction, Request, RequestHandler, Response } from "express";
import multer from "multer";
import { AppError } from "../../../shared/errors/AppError.js";
import { validateUpdateProductBody } from "../validators/products.body.validator.js";
import { MAX_PRODUCT_IMAGE_SIZE_BYTES } from "../validators/products.image.validator.js";

const PRODUCT_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export const productImageUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_PRODUCT_IMAGE_SIZE_BYTES, files: 1, fields: 10 },
    fileFilter: (_req, file, callback) => {
        if (!PRODUCT_IMAGE_MIME_TYPES.has(file.mimetype)) {
            callback(new AppError(415, "La imagen debe estar en formato JPG, PNG o WEBP.", "UNSUPPORTED_PRODUCT_IMAGE"));
            return;
        }
        callback(null, true);
    },
});

function parseCategoryId(value: unknown): unknown {
    if (typeof value !== "string") return value;
    const normalized = value.trim();
    if (!normalized) return null;
    const parsed = Number(normalized);
    return Number.isInteger(parsed) ? parsed : value;
}

function parseBoolean(value: unknown): unknown {
    if (value === "true") return true;
    if (value === "false") return false;
    return value;
}

export const normalizeProductMultipartBody: RequestHandler = (req, _res, next) => {
    req.body ??= {};
    if ("categoryId" in req.body) req.body.categoryId = parseCategoryId(req.body.categoryId);
    if ("isActive" in req.body) req.body.isActive = parseBoolean(req.body.isActive);
    next();
};

export const requireProductImage: RequestHandler = (req, _res, next) => {
    if (!req.file) {
        next(new AppError(400, "La imagen del producto es obligatoria.", "PRODUCT_IMAGE_REQUIRED"));
        return;
    }
    next();
};

export function validateProductUpdateRequest(req: Request, _res: Response, next: NextFunction): void {
    try {
        const body = (req.body ?? {}) as Record<string, unknown>;
        if (Object.keys(body).length === 0 && !req.file) {
            throw new AppError(400, "Debes enviar al menos un campo o una imagen para actualizar.", "VALIDATION_ERROR");
        }
        if (Object.keys(body).length > 0) validateUpdateProductBody(body);
        next();
    } catch (error) {
        next(error);
    }
}
