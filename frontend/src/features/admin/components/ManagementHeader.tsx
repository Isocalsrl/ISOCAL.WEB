import type { ReactNode } from "react";

interface ManagementHeaderProps {
    eyebrow: string;
    title: string;
    description: string;
    actions?: ReactNode;
}

export function ManagementHeader({
    eyebrow,
    title,
    description,
    actions,
}: ManagementHeaderProps) {
    return (
        <header className="management-header">
            <div>
                <p className="eyebrow">
                    {eyebrow}
                </p>

                <h1>{title}</h1>

                <p>{description}</p>
            </div>

            {actions && (
                <div className="management-header-actions">
                    {actions}
                </div>
            )}
        </header>
    );
}
