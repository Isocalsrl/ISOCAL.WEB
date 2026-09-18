import { useId } from "react";
import { useAccessibleDialog } from "../../hooks/useAccessibleDialog";
import { Button } from "./Button";
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
    const titleId = useId();
    const descriptionId = useId();
    const {dialogRef} = useAccessibleDialog<HTMLElement>({
        isOpen,
        onClose: onCancel,
    });

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="dialog-backdrop"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onCancel();
                }
            }}
        >
            <section
                ref={dialogRef}
                className="confirm-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
            >
                <p className="eyebrow">Confirmación</p>

                <h2 id={titleId}>{title}</h2>
                <p id={descriptionId}>{description}</p>

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
                        loadingLabel="Procesando..."
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </section>
        </div>
    );
}
