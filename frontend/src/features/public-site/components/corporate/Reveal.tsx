import { useEffect, useRef, type ReactNode } from "react";

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
            element.classList.add("revealed");
            return;
        }
        element.classList.add("reveal-ready");
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    element.classList.add("revealed");
                    observer.disconnect();
                }
            },
            { threshold: 0.08 },
        );
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}
