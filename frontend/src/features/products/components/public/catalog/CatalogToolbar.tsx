import { Link } from "react-router-dom";

interface CatalogToolbarProps {
    searchTerm: string;

    resultLabel: string;

    hasSearch: boolean;

    onSearchChange: (value: string) => void;

    onClearSearch: () => void;
}

export function CatalogToolbar({
    searchTerm,
    resultLabel,
    hasSearch,
    onSearchChange,
    onClearSearch,
}: CatalogToolbarProps) {
    return (
        <div className="catalog-toolbar">
            <label className="catalog-search">
                <span className="catalog-search-label">Buscar producto</span>

                <span className="catalog-search-control">
                    <svg
                        className="catalog-search-icon"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle cx="10.8" cy="10.8" r="5.8" />
                        <path d="m15.2 15.2 4.3 4.3" />
                    </svg>

                    <input
                        className="catalog-search-input"
                        type="search"
                        value={searchTerm}
                        placeholder="Busca por equipo o marca: Apera, Sonel, pH…"
                        onChange={(event) => {
                            onSearchChange(event.target.value);
                        }}
                    />

                    {hasSearch && (
                        <button
                            className="catalog-search-clear"
                            type="button"
                            aria-label="Limpiar búsqueda"
                            onClick={onClearSearch}
                        >
                            ×
                        </button>
                    )}
                </span>
            </label>

            <div className="catalog-toolbar-meta">
                <p className="catalog-result-count" aria-live="polite">
                    Mostrando <strong>{resultLabel}</strong>
                </p>

                <Link to="/buscar" className="catalog-universal-search-link">
                    Buscar en todo ISOCAL
                </Link>
            </div>
        </div>
    );
}
