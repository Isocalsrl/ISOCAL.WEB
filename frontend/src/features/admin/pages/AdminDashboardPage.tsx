import { Link } from "react-router-dom";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";
import { useAuth } from "../../auth/hooks/useAuth";
import { ManagementHeader } from "../components/ManagementHeader";

const standardCards = [
    {
        to: "/admin/products",
        icon: "package" as const,
        eyebrow: "Catálogo",
        title: "Productos",
        description: "Crea productos, reemplaza imágenes y controla qué equipos aparecen en el catálogo público.",
        action: "Gestionar productos",
    },
    {
        to: "/admin/categories",
        icon: "clipboard" as const,
        eyebrow: "Organización",
        title: "Categorías",
        description: "Ordena el catálogo por familias para que los visitantes encuentren equipos con rapidez.",
        action: "Gestionar categorías",
    },
    {
        to: "/admin/blog",
        icon: "book" as const,
        eyebrow: "Contenido",
        title: "Blog",
        description: "Redacta, previsualiza, publica artículos y administra sus imágenes desde un solo editor.",
        action: "Abrir blog",
    },
];

export function AdminDashboardPage() {
    const { admin } = useAuth();
    const firstName = admin?.name?.trim().split(/\s+/)[0] || "equipo";

    return (
        <section className="management-page admin-dashboard">
            <ManagementHeader
                eyebrow="Panel ISOCAL"
                title={`Hola, ${firstName}.`}
                description="Este es el punto de partida del sitio. Elige una sección para actualizar información pública o revisar la seguridad del panel."
            />

            <div className="admin-dashboard-intro">
                <div>
                    <span className="admin-dashboard-intro-kicker">Gestión diaria</span>
                    <h2>Publica cambios sin perderte entre pantallas.</h2>
                </div>
                <p>
                    Productos, categorías y artículos comparten ahora el mismo lenguaje visual y acciones claras. Los cambios sensibles siguen protegidos por rol.
                </p>
            </div>

            <div className="admin-dashboard-grid">
                {standardCards.map((card) => (
                    <Link className="admin-dashboard-card" key={card.to} to={card.to}>
                        <span className="admin-dashboard-card-icon"><CorporateIcon name={card.icon} /></span>
                        <span className="admin-dashboard-card-eyebrow">{card.eyebrow}</span>
                        <strong>{card.title}</strong>
                        <p>{card.description}</p>
                        <span className="admin-dashboard-card-action">
                            {card.action} <CorporateIcon name="arrow" />
                        </span>
                    </Link>
                ))}

                {admin?.role === "super_admin" && (
                    <Link className="admin-dashboard-card admin-dashboard-card-dark" to="/admin/admins">
                        <span className="admin-dashboard-card-icon"><CorporateIcon name="shield" /></span>
                        <span className="admin-dashboard-card-eyebrow">Seguridad</span>
                        <strong>Administradores</strong>
                        <p>Crea cuentas operativas, desactiva accesos y revisa el historial de inicio de sesión.</p>
                        <span className="admin-dashboard-card-action">
                            Revisar accesos <CorporateIcon name="arrow" />
                        </span>
                    </Link>
                )}
            </div>

            <div className="admin-dashboard-tip">
                <span className="admin-dashboard-tip-icon"><CorporateIcon name="info" /></span>
                <div>
                    <strong>Consejo antes de publicar</strong>
                    <p>Comprueba imágenes, textos y enlaces desde la vista pública. El botón “Sitio público” de la cabecera abre la web en otra pestaña.</p>
                </div>
            </div>
        </section>
    );
}
