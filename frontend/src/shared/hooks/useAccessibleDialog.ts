import { useEffect, useRef } from "react";

const FOCUSABLE_ELEMENTS = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
].join(",");

interface UseAccessibleDialogOptions {
    isOpen?: boolean;
    onClose: () => void;
}

export function useAccessibleDialog<
    TDialog extends HTMLElement = HTMLElement,
>({
    isOpen = true,
    onClose,
}: UseAccessibleDialogOptions) {
    const dialogRef = useRef<TDialog>(null);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const previouslyFocusedElement =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
        const previousBodyOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        const focusableElements = () =>
            dialogRef.current
                ? Array.from(
                      dialogRef.current.querySelectorAll<HTMLElement>(
                          FOCUSABLE_ELEMENTS,
                      ),
                  )
                : [];

        queueMicrotask(() => {
            focusableElements().at(0)?.focus();
        });

        function handleKeyDown(event: KeyboardEvent): void {
            if (event.key === "Escape") {
                event.preventDefault();
                onCloseRef.current();
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const elements = focusableElements();
            const firstElement = elements.at(0);
            const lastElement = elements.at(-1);

            if (!firstElement || !lastElement) {
                event.preventDefault();
                return;
            }

            if (
                event.shiftKey &&
                document.activeElement === firstElement
            ) {
                event.preventDefault();
                lastElement.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === lastElement
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.removeEventListener("keydown", handleKeyDown);
            previouslyFocusedElement?.focus();
        };
    }, [isOpen]);

    return {
        dialogRef,
    };
}
