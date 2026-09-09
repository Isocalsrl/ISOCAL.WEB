import { Router, Request, Response } from "express";
import { db } from "../../database/db.js";
import { authService } from "./auth.service.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { LoginRequest } from "../../shared/types/admin.types.js";

const authRouter = Router();

authRouter.post("/login", async (req: Request, res: Response) => {
    try {
        const email = req.body.email || req.body.correo;
        const password = req.body.password || req.body.contrasena;

        if (!email || !password || typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                error: "Datos incompletos",
                message: "Se requieren correo electrónico y contraseña válidos",
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: "Formato inválido",
                message: "El formato del correo electrónico no es válido",
            });
        }

        const result = await db.query(
            "SELECT * FROM admins WHERE email = $1",
            [email]
        );

        const admin = result.rows[0];

        if (!admin) {
            return res.status(401).json({
                error: "Credenciales inválidas",
                message: "Correo o contraseña incorrectos",
            });
        }

        const isPasswordValid = await authService.comparePassword(
            password,
            admin.password_hash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                error: "Credenciales inválidas",
                message: "Correo o contraseña incorrectos",
            });
        }

        if (!admin.is_active) {
            return res.status(403).json({
                error: "Cuenta inactiva",
                message: "Tu cuenta ha sido desactivada",
            });
        }

        const token = authService.generateToken({
            id: admin.id,
            email: admin.email,
            role: admin.role,
        });

        await db.query(
            "UPDATE admins SET last_login_at = NOW() WHERE id = $1",
            [admin.id]
        );

        const { password_hash: _, ...adminSinPassword } = admin;
        res.json({
            message: "Login exitoso",
            token,
            admin: adminSinPassword,
        });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({
            error: "Error interno",
            message: "Algo salió mal en el servidor",
        });
    }
});

authRouter.get("/me", authMiddleware, async (req: Request, res: Response) => {
    try {
        const adminId = req.adminUser?.id;

        if (!adminId || typeof adminId !== 'number') {
            return res.status(401).json({
                error: "No autorizado",
                message: "Token inválido o malformado",
            });
        }

        const result = await db.query(
            `SELECT id, name, email, role, is_active, 
                    last_login_at, created_at, updated_at 
             FROM admins WHERE id = $1`,
            [adminId]
        );

        const admin = result.rows[0];

        if (!admin) {
            return res.status(404).json({
                error: "Admin no encontrado",
            });
        }

        res.json({
            message: "Datos del admin autenticado",
            admin,
        });
    } catch (error) {
        console.error("Error en /me:", error);
        res.status(500).json({
            error: "Error interno",
            message: "Algo salió mal en el servidor",
        });
    }
});

authRouter.post("/logout", authMiddleware, (req: Request, res: Response) => {
    res.json({
        message: "Logout exitoso",
    });
});

export default authRouter;
