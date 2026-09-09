import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { JWTPayload } from "../shared/types/admin.types.js";

// Extender Express Request para tener acceso a adminUser
declare global {
    namespace Express {
        interface Request {
            adminUser?: JWTPayload;
        }
    }
}

/**
 * Middleware reutilizable para proteger rutas de administrador.
 * Verifica la existencia y validez del token JWT en el header Authorization.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        // 1. Validar que se envíe el header Authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "No autenticado",
                message: "Se requiere un token de autenticación válido",
            });
        }

        // 2. Extraer el token
        const token = authHeader.split(" ")[1];

        // 3. Verificar el token usando la clave secreta
        const decoded = jwt.verify(token, env.jwtSecret as string) as JWTPayload;

        // 4. Inyectar datos del admin en la request para los siguientes endpoints
        req.adminUser = decoded;

        next();
    } catch (error) {
        // Si el token expiró o es inválido, devolver 401 sin exponer detalles internos
        return res.status(401).json({
            error: "Token inválido",
            message: "El token proporcionado no es válido o ha expirado",
        });
    }
};

// Exportar también como authenticateAdmin para mantener compatibilidad con otras rutas
export const authenticateAdmin = authMiddleware;
