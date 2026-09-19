import type { ErrorRequestHandler, Response } from "express";
import multer from "multer";
import { AppError } from "../shared/errors/AppError.js";
import type { ApiError } from "../shared/types/api.types.js";

interface SqlError extends Error {
    code?: string;
    errno?: number;
}

function isSqlError(error: unknown): error is SqlError {
    return error instanceof Error && ("code" in error || "errno" in error);
}

function sendError(res: Response, statusCode: number, code: string, message: string, details?: unknown): Response<ApiError> {
    return res.status(statusCode).json({
        success: false,
        error: {
            code,
            message,
            ...(details !== undefined ? { details } : {}),
        },
    });
}

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof AppError) {
        sendError(res, error.statusCode, error.code, error.message, error.details);
        return;
    }
    if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
            sendError(res, 413, "FILE_TOO_LARGE", "El archivo enviado supera el tamaño permitido.");
            return;
        }
        sendError(res, 400, "INVALID_MULTIPART_REQUEST", "No se pudo procesar el archivo enviado.", { multerCode: error.code });
        return;
    }
    if (error instanceof SyntaxError && "status" in error && error.status === 400) {
        sendError(res, 400, "INVALID_JSON", "El cuerpo de la solicitud contiene JSON inválido.");
        return;
    }
    if (isSqlError(error)) {
        if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
            sendError(res, 409, "RESOURCE_CONFLICT", "Ya existe un registro con uno de los valores únicos enviados.");
            return;
        }
        if (error.code === "ER_NO_REFERENCED_ROW_2" || error.code === "ER_ROW_IS_REFERENCED_2" || error.errno === 1451 || error.errno === 1452) {
            sendError(res, 400, "INVALID_REFERENCE", "Uno de los recursos relacionados no existe o todavía está en uso.");
            return;
        }
    }
    console.error(error);
    sendError(res, 500, "INTERNAL_SERVER_ERROR", "Ocurrió un error interno en el servidor.");
};
