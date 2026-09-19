import type { ReactNode } from "react";
import "./feedback.css";

interface InlineAlertProps {
    children: ReactNode;
    variant?: "error" | "success" | "info";
}

export function InlineAlert({
    children,
    variant = "error",
}: InlineAlertProps) {
    const symbol =
        variant === "success"
            ? "✓"
            : variant === "info"
              ? "i"
              : "!";

    return (
        <div
            className={`inline-alert inline-alert-${variant}`}
            role={
                variant === "error"
                    ? "alert"
                    : "status"
            }
        >
            <span
                className="inline-alert-icon"
                aria-hidden="true"
            >
                {symbol}
            </span>

            <div>{children}</div>
        </div>
    );
}
