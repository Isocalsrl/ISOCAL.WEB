import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    BrandMark,
} from "../../../shared/components/brand/BrandMark";

import {
    contactUrl,
} from "../data/company";

import {
    PublicNavigation,
} from "./PublicNavigation";

export function PublicHeader() {
    const [
        isNavigationOpen,
        setIsNavigationOpen,
    ] = useState(false);

    const [
        openSubmenu,
        setOpenSubmenu,
    ] = useState<string | null>(null);

    const closeNavigation =
        useCallback((): void => {
            setIsNavigationOpen(
                false,
            );
            setOpenSubmenu(
                null,
            );
        }, []);

    useEffect(() => {
        function closeOnEscape(
            event:
                KeyboardEvent,
        ): void {
            if (
                event.key ===
                "Escape"
            ) {
                closeNavigation();
            }
        }

        document.addEventListener(
            "keydown",
            closeOnEscape,
        );

        return () => {
            document.removeEventListener(
                "keydown",
                closeOnEscape,
            );
        };
    }, [
        closeNavigation,
    ]);

    function toggleSubmenu(
        itemTo:
            string,
    ): void {
        setOpenSubmenu(
            (
                currentSubmenu,
            ) =>
                currentSubmenu ===
                itemTo
                    ? null
                    : itemTo,
        );
    }

    return (
        <header className="public-header">
            <div className="public-container public-header-content">
                <BrandMark
                    imageSrc="/images/brand/isocal-logo.svg"
                    onNavigate={
                        closeNavigation
                    }
                />

                <button
                    className="public-menu-button"
                    type="button"
                    aria-label={
                        isNavigationOpen
                            ? "Cerrar menú de navegación"
                            : "Abrir menú de navegación"
                    }
                    aria-controls="public-navigation"
                    aria-expanded={
                        isNavigationOpen
                    }
                    onClick={() => {
                        setIsNavigationOpen(
                            (
                                currentValue,
                            ) =>
                                !currentValue,
                        );
                    }}
                >
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                    <span aria-hidden="true" />
                </button>

                <div
                    id="public-navigation"
                    className={
                        isNavigationOpen
                            ? "public-navigation-panel public-navigation-panel-open"
                            : "public-navigation-panel"
                    }
                >
                    <PublicNavigation
                        openSubmenu={
                            openSubmenu
                        }
                        onClose={
                            closeNavigation
                        }
                        onToggleSubmenu={
                            toggleSubmenu
                        }
                    />

                    <a
                        className="public-header-contact"
                        href={contactUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={
                            closeNavigation
                        }
                    >
                        Solicitar atención
                    </a>
                </div>
            </div>
        </header>
    );
}
