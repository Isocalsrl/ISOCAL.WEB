export type AdminRole = "admin" | "super_admin";

export interface AdminActor {
    id: number;
    role: AdminRole;
}
