import "./ui.css";

interface StatusBadgeProps {
    isActive: boolean;
    activeLabel?: string;
    inactiveLabel?: string;
}

export function StatusBadge({
    isActive,
    activeLabel = "Activo",
    inactiveLabel = "Inactivo",
}: StatusBadgeProps) {
    return (
        <span
            className={
                isActive
                    ? "status-badge"
                    : "status-badge status-badge-inactive"
            }
        >
            {isActive
                ? activeLabel
                : inactiveLabel}
        </span>
    );
}
