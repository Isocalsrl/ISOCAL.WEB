export type AdminRole =
    | "admin"
    | "super_admin";

export interface Admin {
    id: number;
    name: string;
    email: string;
    role: AdminRole;
    isActive: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface AdminWithPasswordHash
    extends Admin {
        passwordHash: string;
    }

export interface LoginInput {
    email: string;
    password: string;
}

export interface LoginResult {
    admin: Admin;
    sessionToken: string;
    expiresAt: Date;
}

declare global {
    namespace Express {
        interface Request {
            admin?: Admin;
        }
    }
}
