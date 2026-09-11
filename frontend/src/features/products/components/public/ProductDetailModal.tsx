import {
    useEffect,
    useId,
    useRef,
} from "react";

import {
    createPortal,
} from "react-dom";

import {
    contactUrl,
} from "../../../public-site/data/company";

import type {
    PublicProduct,
} from "../../types/product.types";

interface ProductDetailModalProps {
    product:
        PublicProduct;

    categoryName:
        string;

    onClose:
        () => void;
}

const FOCUSABLE_ELEMENTS = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
].join(",");

export function ProductDetailModal({
    product,
    categoryName,
    onClose,
}: ProductDetailModalProps) {
    const titleId =
        useId();

    const descriptionId =
        useId();

    const dialogRef =
        useRef<HTMLDivElement>(
            null,
        );

    const closeButtonRef =
        useRef<HTMLButtonElement>(
            null,
        );

    useEffect(() => {
        const previouslyFocusedElement =
            document.activeElement instanceof
            HTMLElement
                ? document.activeElement
                : null;

        const previousBodyOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        closeButtonRef.current?.focus();

        function handleKeyDown(
            event: KeyboardEvent,
        ): void {
            if (
                event.key ===
                "Escape"
            ) {
                event.preventDefault();
                onClose();

                return;
            }

            if (
                event.key !==
                    "Tab" ||
                !dialogRef.current
            ) {
                return;
            }

            const focusableElements =
                Array.from(
                    dialogRef.current.querySelectorAll<HTMLElement>(
                        FOCUSABLE_ELEMENTS,
                    ),
                );

            const firstElement =
                focusableElements.at(
                    0,
                );

            const lastElement =
                focusableElements.at(
                    -1,
                );

            if (
                !firstElement ||
                !lastElement
            ) {
                return;
            }

            if (
                event.shiftKey &&
                document.activeElement ===
                    firstElement
            ) {
                event.preventDefault();
                lastElement.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement ===
                    lastElement
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        }

        document.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            document.body.style.overflow =
                previousBodyOverflow;

            document.removeEventListener(
                "keydown",
                handleKeyDown,
            );

            previouslyFocusedElement?.focus();
        };
    }, [
        onClose,
    ]);

    return createPortal(
        <div
            className="product-modal-backdrop"
            onMouseDown={(
                event,
            ) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div
                ref={dialogRef}
                className="product-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby={
                    titleId
                }
                aria-describedby={
                    descriptionId
                }
            >
                <div
                    className="product-modal-accent"
                    aria-hidden="true"
                >
                    <span>
                        ISOCAL
                    </span>

                    <strong>
                        {
                            String(
                                product.id,
                            ).padStart(
                                2,
                                "0",
                            )
                        }
                    </strong>
                </div>

                <div className="product-modal-content">
                    <button
                        ref={
                            closeButtonRef
                        }
                        className="product-modal-close"
                        type="button"
                        aria-label="Cerrar detalle del producto"
                        onClick={
                            onClose
                        }
                    >
                        <span
                            aria-hidden="true"
                        />

                        <span
                            aria-hidden="true"
                        />
                    </button>

                    <p className="product-modal-category">
                        {
                            categoryName
                        }
                    </p>

                    <h2
                        id={
                            titleId
                        }
                    >
                        {
                            product.name
                        }
                    </h2>

                    <p
                        id={
                            descriptionId
                        }
                        className={
                            product.description
                                ? "product-modal-description"
                                : "product-modal-description product-modal-description-empty"
                        }
                    >
                        {
                            product.description ??
                            "Este producto todavía no cuenta con una descripción pública. Puedes consultar directamente con ISOCAL para conocer sus características y disponibilidad."
                        }
                    </p>

                    <div className="product-modal-footer">
                        <div>
                            <span>
                                Atención
                                técnica
                            </span>

                            <p>
                                Consulta
                                disponibilidad
                                y
                                características
                                para tu
                                operación.
                            </p>
                        </div>

                        <a
                            className="ui-button ui-button-primary"
                            href={
                                contactUrl(
                                    product.name,
                                )
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Consultar
                            producto
                        </a>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}