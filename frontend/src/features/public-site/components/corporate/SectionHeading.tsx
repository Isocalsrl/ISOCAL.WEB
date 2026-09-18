import type { ReactNode } from "react";

interface SectionHeadingProps {
    eyebrow: string;
    title: ReactNode;
    description?: string;
    action?: ReactNode;
}

export function SectionHeading({ eyebrow, title, description, action }: SectionHeadingProps) {
    return (
        <div className="co-section-heading">
            <div>
                <span className="co-eyebrow">{eyebrow}</span>
                <h2>{title}</h2>
                {description && <p>{description}</p>}
            </div>
            {action}
        </div>
    );
}
