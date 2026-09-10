import type {
    ButtonHTMLAttributes,
    ReactNode,
} from "react";

import "./ui.css";

type ButtonVariant =
    | "primary"
    | "dark"
    | "secondary"
    | "danger"
    | "quiet";

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
        children: ReactNode;
        variant?: ButtonVariant;
        isLoading?: boolean;
        loadingLabel?: string;
    }

export function Button({
    children,
    variant = "primary",
    isLoading = false,
    loadingLabel = "Procesando...",
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={`ui-button ui-button-${variant} ${className}`.trim()}
            disabled={
                disabled ||
                isLoading
            }
            {...props}
        >
            {isLoading && (
                <span
                    className="ui-button-spinner"
                    aria-hidden="true"
                />
            )}

            {isLoading
                ? loadingLabel
                : children}
        </button>
    );
}
