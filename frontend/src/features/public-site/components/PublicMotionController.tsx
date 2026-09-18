import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const MOTION_SELECTOR = [
    ".ix-section-intro",
    ".ix-home-category-card",
    ".ix-home-service-card",
    ".catalog-product-card",
    ".blog-card",
    ".technical-result-card",
    ".ix-quotation-step",
    ".co-stat",
    ".ix-assurance-card",
    ".ix-network-card",
    ".ix-service-card",
    ".co-request-product",
].join(",");

export function PublicMotionController() {
    const location = useLocation();

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const observed = new WeakSet<Element>();
        const cleanupTimers = new Set<number>();
        let sequence = 0;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const element = entry.target as HTMLElement;
                    element.classList.add("ix-motion-visible");
                    observer.unobserve(element);
                    const delay = Number.parseInt(element.style.getPropertyValue("--ix-auto-reveal-delay"), 10) || 0;
                    const timer = window.setTimeout(() => {
                        element.classList.remove("ix-motion-pending", "ix-motion-visible");
                        element.style.removeProperty("--ix-auto-reveal-delay");
                        cleanupTimers.delete(timer);
                    }, delay + 620);
                    cleanupTimers.add(timer);
                });
            },
            { threshold: 0.08, rootMargin: "0px 0px -5%" },
        );

        const register = (root: ParentNode) => {
            root.querySelectorAll<HTMLElement>(MOTION_SELECTOR).forEach((element) => {
                if (observed.has(element) || element.closest("[aria-hidden='true']")) return;
                observed.add(element);
                const delay = Math.min(sequence % 5, 4) * 45;
                sequence += 1;
                element.style.setProperty("--ix-auto-reveal-delay", `${delay}ms`);
                element.classList.add("ix-motion-pending");
                observer.observe(element);
            });
        };

        register(document);
        const mutations = new MutationObserver((records) => {
            for (const record of records) {
                record.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) register(node);
                });
            }
        });
        mutations.observe(document.getElementById("root") ?? document.body, { childList: true, subtree: true });

        return () => {
            mutations.disconnect();
            observer.disconnect();
            cleanupTimers.forEach((timer) => window.clearTimeout(timer));
            cleanupTimers.clear();
        };
    }, [location.pathname, location.search]);

    return null;
}
