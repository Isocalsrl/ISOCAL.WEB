import { request } from "../../../shared/api/httpClient";
import type { Admin } from "../../auth/types/auth.types";

const PATH = "/api/admin/auth/admins";

export interface CreateAdminAccountPayload {
    name: string;
    email: string;
    password: string;
}

export function getAdminAccounts(): Promise<Admin[]> {
    return request<Admin[]>(PATH);
}

export function createAdminAccount(payload: CreateAdminAccountPayload): Promise<Admin> {
    return request<Admin>(PATH, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updateAdminAccountStatus(id: number, isActive: boolean): Promise<Admin> {
    return request<Admin>(`${PATH}/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
    });
}
