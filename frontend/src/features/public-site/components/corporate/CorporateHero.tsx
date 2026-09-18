import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface CorporateHeroProps {
    eyebrow: string;
    title: ReactNode;
    description: string;
    image?: string;
}

export function CorporateHero({
    eyebrow,
    title,
    description,
    image = "/images/editorial/instrumentacion.webp",
}: CorporateHeroProps) {
    return (
        <section className="co-page-hero">
            <img src={image.startsWith("/") ? image : `/images/company/${image}`} alt="" />
            <div className="public-container">
                <p className="co-breadcrumb">
                    <Link to="/">Inicio</Link>
                    <span>/</span>
                    {eyebrow}
                </p>
                <span className="co-eyebrow">{eyebrow}</span>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
        </section>
    );
}
