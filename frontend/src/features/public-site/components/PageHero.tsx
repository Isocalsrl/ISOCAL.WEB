import type { ReactNode } from "react";

interface PageHeroProps {
    eyebrow: string;
    title: string;
    description: string;
    actions?: ReactNode;
}

export function PageHero({
    eyebrow,
    title,
    description,
    actions,
}: PageHeroProps) {
    return (
        <section className="public-page-hero">
            <div className="public-container public-page-hero-content">
                <p className="eyebrow">
                    {eyebrow}
                </p>
                <h1>{title}</h1>
                <p className="public-page-hero-description">
                    {description}
                </p>

                {actions && (
                    <div className="public-actions">
                        {actions}
                    </div>
                )}
            </div>
        </section>
    );
}
