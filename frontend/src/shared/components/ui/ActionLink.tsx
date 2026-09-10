import type {
    ReactNode,
} from "react";

import {
    Link,
} from "react-router-dom";

import "./ui.css";

interface ActionLinkProps {
    children: ReactNode;
    to: string;
    variant?:
        | "primary"
        | "dark"
        | "secondary"
        | "light";
}

export function ActionLink({
    children,
    to,
    variant = "primary",
}: ActionLinkProps) {
    return (
        <Link
            className={`ui-button ui-button-${variant}`}
            to={to}
        >
            {children}
        </Link>
    );
}
