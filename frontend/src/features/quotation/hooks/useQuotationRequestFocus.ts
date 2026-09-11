import {
    useEffect,
    useRef,
} from "react";

export function useQuotationRequestFocus(
    isOpen: boolean,
) {
    const requestFormRef =
        useRef<HTMLFormElement>(
            null,
        );

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const animationFrame =
            window.requestAnimationFrame(
                () => {
                    const requestForm =
                        requestFormRef.current;

                    if (!requestForm) {
                        return;
                    }

                    const formBounds =
                        requestForm.getBoundingClientRect();

                    const scrollMarginTop =
                        Number.parseFloat(
                            window.getComputedStyle(
                                requestForm,
                            ).scrollMarginTop,
                        ) || 0;

                    const isFullyVisible =
                        formBounds.top >=
                            scrollMarginTop &&
                        formBounds.bottom <=
                            window.innerHeight;

                    const prefersReducedMotion =
                        window.matchMedia(
                            "(prefers-reduced-motion: reduce)",
                        ).matches;

                    if (!isFullyVisible) {
                        requestForm.scrollIntoView(
                            {
                                behavior:
                                    prefersReducedMotion
                                        ? "auto"
                                        : "smooth",
                                block: "start",
                            },
                        );
                    }

                    requestForm
                        .querySelector<HTMLInputElement>(
                            "#quote-full-name",
                        )
                        ?.focus({
                            preventScroll:
                                true,
                        });
                },
            );

        return () =>
            window.cancelAnimationFrame(
                animationFrame,
            );
    }, [
        isOpen,
    ]);

    return requestFormRef;
}
