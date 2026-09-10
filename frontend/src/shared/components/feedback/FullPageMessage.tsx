import "./feedback.css";

interface FullPageMessageProps {
    title: string;
    description: string;
    icon?: string;
    actionLabel?: string;
    actionDisabled?: boolean;
    onAction?: () => void;
}

export function FullPageMessage({
    title,
    description,
    icon = "!",
    actionLabel,
    actionDisabled = false,
    onAction,
}: FullPageMessageProps) {
    return (
        <main className="full-page-feedback">
            <div
                className="full-page-feedback-icon"
                aria-hidden="true"
            >
                {icon}
            </div>

            <h1>{title}</h1>

            <p>{description}</p>

            {actionLabel && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    disabled={actionDisabled}
                >
                    {actionLabel}
                </button>
            )}
        </main>
    );
}
