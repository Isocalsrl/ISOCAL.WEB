import type { RefObject } from "react";
import { Link } from "react-router-dom";
import { UniversalSearchBar } from "../../../search/components/UniversalSearchBar";

const SEARCH_SUGGESTIONS = [
    ["Manómetros", "manómetro"],
    ["Temperatura", "temperatura"],
    ["Balanzas", "balanza"],
    ["0-300 PSI", "0-300 PSI"],
] as const;

interface HeaderSearchPanelProps {
    isOpen: boolean;
    searchRegionRef: RefObject<HTMLDivElement | null>;
    onNavigate: () => void;
}

export function HeaderSearchPanel({ isOpen, searchRegionRef, onNavigate }: HeaderSearchPanelProps) {
    return (
        <div
            id="ix-header-search"
            className={`ix-header-search${isOpen ? " is-open" : ""}`}
            ref={searchRegionRef}
            aria-hidden={!isOpen}
        >
            {isOpen && (
                <div className="public-container ix-header-search-inner">
                    <div className="ix-header-search-copy">
                        <small>Buscador técnico</small>
                        <strong>Busca en ISOCAL</strong>
                        <span>Producto, magnitud, unidad o servicio.</span>
                    </div>
                    <div className="ix-header-search-control">
                        <UniversalSearchBar compact autoFocus onNavigate={onNavigate} />
                        <div className="ix-header-search-suggestions" aria-label="Búsquedas sugeridas">
                            <span>Prueba con:</span>
                            {SEARCH_SUGGESTIONS.map(([label, query]) => (
                                <Link key={query} to={`/buscar?q=${encodeURIComponent(query)}`} onClick={onNavigate}>
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
