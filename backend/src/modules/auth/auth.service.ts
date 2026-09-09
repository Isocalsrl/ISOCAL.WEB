import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { JWTPayload } from "../../shared/types/admin.types.js";

export const authService = {
    async hashPassword(password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    },

    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        const isValid = await bcrypt.compare(password, hashedPassword);
        return isValid;
    },

    generateToken(payload: JWTPayload): string {
        const token = jwt.sign(payload, env.jwtSecret as string, {
            expiresIn: env.jwtExpiration as any,
        });
        return token;
    },

    verifyToken(token: string): JWTPayload | null {
        try {
            const decoded = jwt.verify(token, env.jwtSecret as string) as JWTPayload;
            return decoded;
        } catch (error) {
            return null;
        }
    },
};
