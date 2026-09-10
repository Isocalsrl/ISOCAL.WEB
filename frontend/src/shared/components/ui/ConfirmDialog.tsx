import {
    Button,
} from "./Button";

import "./ui.css";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    isConfirming?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

export function ConfirmDialog({
    isOpen,
    title,
    description,
    confirmLabel,
    isConfirming = false,
    onCancel,
    onConfirm,
}: ConfirmDialogProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="dialog-backdrop"
            role="presentation"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onCancel();
                }
            }}
        >
            <section
                className="confirm-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
            >
                <p className="eyebrow">
                    Confirmación
                </p>

                <h2 id="confirm-dialog-title">
                    {title}
                </h2>

                <p>{description}</p>

                <div className="confirm-dialog-actions">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isConfirming}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="button"
                        variant="danger"
                        onClick={onConfirm}
                        isLoading={isConfirming}
                        loadingLabel="Desactivando..."
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </section>
        </div>
    );
}
