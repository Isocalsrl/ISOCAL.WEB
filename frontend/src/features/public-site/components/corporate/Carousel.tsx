import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";

export function Carousel({ children, label }: { children: ReactNode; label: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const dragState = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
    const [dragging, setDragging] = useState(false);

    function move(direction: number) {
        const element = ref.current;
        if (element) {
            element.scrollBy({
                left: direction * ((element.firstElementChild?.getBoundingClientRect().width || 300) + 24),
                behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
            });
        }
    }

    function pointerDown(event: ReactPointerEvent<HTMLDivElement>) {
        if (event.pointerType === "touch") return;
        const element = ref.current;
        if (!element) return;
        dragState.current = {
            active: true,
            startX: event.clientX,
            scrollLeft: element.scrollLeft,
            moved: false,
        };
        setDragging(true);
        element.setPointerCapture(event.pointerId);
    }

    function pointerMove(event: ReactPointerEvent<HTMLDivElement>) {
        const element = ref.current;
        if (!element || !dragState.current.active) return;
        const delta = event.clientX - dragState.current.startX;
        if (Math.abs(delta) > 5) dragState.current.moved = true;
        element.scrollLeft = dragState.current.scrollLeft - delta;
    }

    function pointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
        const element = ref.current;
        if (!element || !dragState.current.active) return;
        dragState.current.active = false;
        setDragging(false);
        if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
    }

    return (
        <div className="co-carousel" role="region" aria-label={label}>
            <div
                className={`co-carousel-track${dragging ? " is-dragging" : ""}`}
                ref={ref}
                tabIndex={0}
                aria-label={`${label}. Arrastra, desliza o usa las flechas para explorar.`}
                onPointerDown={pointerDown}
                onPointerMove={pointerMove}
                onPointerUp={pointerEnd}
                onPointerCancel={pointerEnd}
                onClickCapture={(event) => {
                    if (dragState.current.moved) {
                        event.preventDefault();
                        event.stopPropagation();
                        dragState.current.moved = false;
                    }
                }}
                onKeyDown={(event) => {
                    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                        event.preventDefault();
                        move(event.key === "ArrowRight" ? 1 : -1);
                    }
                }}
            >
                {children}
            </div>
            <div className="co-carousel-controls">
                <span>Arrastra o usa las flechas</span>
                <button type="button" onClick={() => move(-1)} aria-label={`Anterior: ${label}`}>
                    <CorporateIcon name="arrow" style={{ transform: "rotate(180deg)" }} />
                </button>
                <button type="button" onClick={() => move(1)} aria-label={`Siguiente: ${label}`}>
                    <CorporateIcon name="arrow" />
                </button>
            </div>
        </div>
    );
}
