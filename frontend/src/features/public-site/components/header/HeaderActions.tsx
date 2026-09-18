import type { Dispatch, RefObject, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";
import { FavoritesHeaderLink } from "../../../favorites/components/FavoritesHeaderLink";
import { useQuotation } from "../../../quotation/hooks/useQuotation";

interface HeaderActionsProps {
    menuOpen: boolean;
    searchOpen: boolean;
    menuToggleRef: RefObject<HTMLButtonElement | null>;
    searchToggleRef: RefObject<HTMLButtonElement | null>;
    setMenuOpen: Dispatch<SetStateAction<boolean>>;
    setSearchOpen: Dispatch<SetStateAction<boolean>>;
    setServicesOpen: Dispatch<SetStateAction<boolean>>;
    onNavigate: () => void;
}

export function HeaderActions({
    menuOpen,
    searchOpen,
    menuToggleRef,
    searchToggleRef,
    setMenuOpen,
    setSearchOpen,
    setServicesOpen,
    onNavigate,
}: HeaderActionsProps) {
    const {quotationCount} = useQuotation();

    return (
        <div className="ix-nav-actions">
            <button
                ref={searchToggleRef}
                className={`ix-nav-search-link${searchOpen ? " is-open" : ""}`}
                type="button"
                aria-label={searchOpen ? "Cerrar buscador técnico" : "Abrir buscador técnico"}
                aria-expanded={searchOpen}
                aria-controls="ix-header-search"
                onClick={() => {
                    setSearchOpen((value) => !value);
                    setServicesOpen(false);
                }}
            >
                <CorporateIcon name={searchOpen ? "close" : "search"} />
                <span className="ix-nav-search-label">Buscar</span>
            </button>
            <FavoritesHeaderLink onNavigate={onNavigate} />
            <Link className="ix-nav-quote" to="/cotizacion" onClick={onNavigate}>
                Solicitar cotización
                {quotationCount > 0 && <span className="ix-nav-quote-count">{quotationCount}</span>}
                <CorporateIcon name="arrow" />
            </Link>
            <button
                ref={menuToggleRef}
                className="ix-menu-button"
                type="button"
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={menuOpen}
                aria-controls="ix-primary-navigation"
                onClick={() => {
                    setMenuOpen((value) => !value);
                    setSearchOpen(false);
                }}
            >
                <CorporateIcon name={menuOpen ? "close" : "menu"} />
            </button>
        </div>
    );
}
