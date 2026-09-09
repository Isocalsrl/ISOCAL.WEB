export interface Admin {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    role: string;
    is_active: boolean;
    last_login_at: Date | null;
    created_at: Date;
    updated_at: Date;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    admin: Omit<Admin, 'password_hash'>;
}

export interface JWTPayload {
    id: number;
    email: string;
    role: string;
}
