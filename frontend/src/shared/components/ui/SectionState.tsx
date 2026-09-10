import {
    Button,
} from "./Button";

import "./ui.css";

interface SectionStateProps {
    title: string;
    description: string;
    isLoading?: boolean;
    actionLabel?: string;
    onAction?: () => void;
}

export function SectionState({
    title,
    description,
    isLoading = false,
    actionLabel,
    onAction,
}: SectionStateProps) {
    return (
        <section
            className="section-state"
            aria-live="polite"
            aria-busy={isLoading}
        >
            {isLoading && (
                <span
                    className="section-state-spinner"
                    aria-hidden="true"
                />
            )}

            <h2>{title}</h2>

            <p>{description}</p>

            {actionLabel && onAction && (
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onAction}
                >
                    {actionLabel}
                </Button>
            )}
        </section>
    );
}
