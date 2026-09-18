import { useEffect, useRef, useState } from "react";

export function Count({ value, label }: { value: number; label: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const [count, setCount] = useState(() =>
        typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches ? value : 0,
    );

    useEffect(() => {
        let frame = 0;
        const element = ref.current;
        if (!element) return;
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            const start = performance.now();
            const tick = (now: number) => {
                const progress = Math.min((now - start) / 1300, 1);
                setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
                if (progress < 1) frame = requestAnimationFrame(tick);
            };
            frame = requestAnimationFrame(tick);
        });
        observer.observe(element);
        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [value]);

    return (
        <div ref={ref} className="co-stat">
            <strong aria-hidden="true">{count.toString().padStart(2, "0")}</strong>
            <span className="sr-only">{value}</span>
            <span>{label}</span>
        </div>
    );
}
