import { useEffect, useRef, useState } from "react";

export function usePublicHeaderState() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRegionRef = useRef<HTMLDivElement>(null);
    const servicesToggleRef = useRef<HTMLButtonElement>(null);
    const searchToggleRef = useRef<HTMLButtonElement>(null);
    const menuToggleRef = useRef<HTMLButtonElement>(null);

    function closeAll() {
        setMenuOpen(false);
        setServicesOpen(false);
        setSearchOpen(false);
    }

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        function onKey(event: KeyboardEvent) {
            if (event.key !== "Escape") return;

            if (searchOpen) {
                setSearchOpen(false);
                searchToggleRef.current?.focus();
                return;
            }
            if (servicesOpen) {
                setServicesOpen(false);
                servicesToggleRef.current?.focus();
                return;
            }
            if (menuOpen) {
                setMenuOpen(false);
                menuToggleRef.current?.focus();
            }
        }

        function onPointerDown(event: PointerEvent) {
            const target = event.target as Node;
            if (!dropdownRef.current?.contains(target)) setServicesOpen(false);
            if (
                searchOpen &&
                !searchRegionRef.current?.contains(target) &&
                !searchToggleRef.current?.contains(target)
            ) {
                setSearchOpen(false);
            }
        }

        document.addEventListener("keydown", onKey);
        document.addEventListener("pointerdown", onPointerDown);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("pointerdown", onPointerDown);
        };
    }, [menuOpen, searchOpen, servicesOpen]);

    return {
        menuOpen,
        servicesOpen,
        searchOpen,
        scrolled,
        dropdownRef,
        searchRegionRef,
        servicesToggleRef,
        searchToggleRef,
        menuToggleRef,
        setMenuOpen,
        setServicesOpen,
        setSearchOpen,
        closeAll,
    };
}
