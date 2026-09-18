import { Link } from "react-router-dom";
import { CorporateIcon } from "../ui/CorporateIcon";

type PublicStateVariant =
    | "empty"
    | "error"
    | "network"
    | "not-found"
    | "success"
    | "info";

interface PublicStateAction {
    label: string;
    onClick?: () => void;
    to?: string;
}

interface PublicStatePanelProps {
    title: string;
    description: string;
    variant?: PublicStateVariant;
    eyebrow?: string;
    primaryAction?: PublicStateAction;
    secondaryAction?: PublicStateAction;
    compact?: boolean;
}

const ICON_BY_VARIANT = {
    empty: "package",
    error: "info",
    network: "layers",
    "not-found": "search",
    success: "check",
    info: "info",
} as const;

function StateAction({
    action,
    primary,
}: {
    action: PublicStateAction;
    primary: boolean;
}) {
    const className = primary
        ? "ui-button ui-button-primary"
        : "ui-button ui-button-secondary";

    if (action.to) {
        return (
            <Link className={className} to={action.to}>
                {action.label}
            </Link>
        );
    }

    return (
        <button className={className} type="button" onClick={action.onClick}>
            {action.label}
        </button>
    );
}

export function PublicStatePanel({
    title,
    description,
    variant = "info",
    eyebrow,
    primaryAction,
    secondaryAction,
    compact = false,
}: PublicStatePanelProps) {
    const isError = variant === "error" || variant === "network";

    return (
        <section
            className={`ix-state-panel ix-state-panel-${variant}${compact ? " ix-state-panel-compact" : ""}`}
            aria-live={isError ? "assertive" : "polite"}
            role={isError ? "alert" : "status"}
        >
            <div className="ix-state-panel-icon" aria-hidden="true">
                <CorporateIcon name={ICON_BY_VARIANT[variant]} />
            </div>

            <div className="ix-state-panel-copy">
                {eyebrow ? <p className="ix-state-panel-eyebrow">{eyebrow}</p> : null}
                <h2>{title}</h2>
                <p>{description}</p>
            </div>

            {primaryAction || secondaryAction ? (
                <div className="ix-state-panel-actions">
                    {primaryAction ? <StateAction action={primaryAction} primary /> : null}
                    {secondaryAction ? <StateAction action={secondaryAction} primary={false} /> : null}
                </div>
            ) : null}
        </section>
    );
}
