import { useEffect, useState, type FormEvent } from "react";
import { ApiError } from "../../../shared/api/httpClient";
import { InlineAlert } from "../../../shared/components/feedback/InlineAlert";
import { Button } from "../../../shared/components/ui/Button";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";
import { FormField } from "../../../shared/components/ui/FormField";
import { ManagementHeader } from "../../admin/components/ManagementHeader";
import type { Admin } from "../../auth/types/auth.types";
import { createAdminAccount, getAdminAccounts, updateAdminAccountStatus } from "../api/adminUsers.api";

function formatDate(value: string): string {
    return new Intl.DateTimeFormat("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

export function AdminUsersPage() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [busyAdminId, setBusyAdminId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function load(): Promise<void> {
        setError(null);
        try {
            setAdmins(await getAdminAccounts());
        } catch (cause) {
            setError(cause instanceof ApiError ? cause.message : "No se pudieron cargar las cuentas.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => { void load(); }, []);

    async function handleCreate(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const payload = {
            name: String(data.get("name") ?? "").trim(),
            email: String(data.get("email") ?? "").trim(),
            password: String(data.get("password") ?? ""),
        };

        setError(null);
        setSuccess(null);
        setIsCreating(true);
        try {
            const created = await createAdminAccount(payload);
            setAdmins((current) => [...current, created]);
            form.reset();
            setSuccess(`Cuenta creada para ${created.email}.`);
        } catch (cause) {
            setError(cause instanceof ApiError ? cause.message : "No se pudo crear la cuenta.");
        } finally {
            setIsCreating(false);
        }
    }

    async function toggleStatus(admin: Admin): Promise<void> {
        if (admin.role !== "admin") return;
        setError(null);
        setSuccess(null);
        setBusyAdminId(admin.id);
        try {
            const updated = await updateAdminAccountStatus(admin.id, !admin.isActive);
            setAdmins((current) => current.map((item) => (item.id === updated.id ? updated : item)));
            setSuccess(updated.isActive ? "Cuenta reactivada." : "Cuenta desactivada.");
        } catch (cause) {
            setError(cause instanceof ApiError ? cause.message : "No se pudo actualizar la cuenta.");
        } finally {
            setBusyAdminId(null);
        }
    }

    return (
        <section className="management-page">
            <ManagementHeader
                eyebrow="Seguridad"
                title="Administradores"
                description="Crea cuentas operativas y controla quién puede entrar al panel. El superadministrador conserva el acceso principal."
            />

            {error && <InlineAlert>{error}</InlineAlert>}
            {success && <InlineAlert variant="success">{success}</InlineAlert>}

            <div className="admin-users-layout">
                <form className="admin-form-section admin-account-form" onSubmit={(event) => void handleCreate(event)}>
                    <div className="admin-form-section-heading">
                        <span className="admin-form-section-number"><CorporateIcon name="user" /></span>
                        <div>
                            <h2>Crear administrador</h2>
                            <p>La nueva cuenta tendrá permisos operativos, pero no podrá crear otros administradores.</p>
                        </div>
                    </div>

                    <div className="management-form">
                        <FormField htmlFor="admin-name" label="Nombre" required>
                            <input className="form-control" id="admin-name" name="name" maxLength={120} autoComplete="name" required />
                        </FormField>
                        <FormField htmlFor="admin-email" label="Correo" required>
                            <input className="form-control" id="admin-email" name="email" type="email" maxLength={254} autoComplete="email" required />
                        </FormField>
                        <FormField
                            htmlFor="admin-password"
                            label="Contraseña temporal"
                            hint="Mínimo 12 caracteres. Compártela por un canal seguro y pide al usuario que la cambie cuando corresponda."
                            required
                        >
                            <input className="form-control" id="admin-password" name="password" type="password" minLength={12} maxLength={128} autoComplete="new-password" required />
                        </FormField>
                        <Button type="submit" isLoading={isCreating} loadingLabel="Creando cuenta...">
                            Crear administrador
                        </Button>
                    </div>
                </form>

                <section className="admin-accounts-panel">
                    <div className="admin-panel-heading">
                        <div>
                            <span className="admin-panel-kicker">Cuentas del sistema</span>
                            <h2>Accesos administrativos</h2>
                        </div>
                        <span className="admin-panel-count">{isLoading ? "…" : admins.length}</span>
                    </div>

                    {isLoading ? (
                        <div className="admin-panel-empty">Cargando cuentas…</div>
                    ) : (
                        <div className="admin-account-grid">
                            {admins.map((admin) => (
                                <article className="admin-account-card" key={admin.id}>
                                    <div className="admin-account-card-head">
                                        <span className="admin-account-avatar">{admin.name.trim().charAt(0).toUpperCase() || "A"}</span>
                                        <div>
                                            <strong>{admin.name}</strong>
                                            <span>{admin.email}</span>
                                        </div>
                                    </div>
                                    <div className="admin-account-meta">
                                        <div>
                                            <span>Rol</span>
                                            <strong>{admin.role === "super_admin" ? "Superadministrador" : "Administrador"}</strong>
                                        </div>
                                        <div>
                                            <span>Estado</span>
                                            <strong className={admin.isActive ? "is-success" : "is-danger"}>{admin.isActive ? "Activo" : "Inactivo"}</strong>
                                        </div>
                                        <div>
                                            <span>Último acceso</span>
                                            <strong>{admin.lastLoginAt ? formatDate(admin.lastLoginAt) : "Sin accesos"}</strong>
                                        </div>
                                    </div>
                                    {admin.role === "admin" && (
                                        <Button
                                            className="admin-account-action"
                                            type="button"
                                            variant={admin.isActive ? "danger" : "secondary"}
                                            isLoading={busyAdminId === admin.id}
                                            loadingLabel="Guardando..."
                                            onClick={() => void toggleStatus(admin)}
                                        >
                                            {admin.isActive ? "Desactivar cuenta" : "Reactivar cuenta"}
                                        </Button>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </section>
    );
}
