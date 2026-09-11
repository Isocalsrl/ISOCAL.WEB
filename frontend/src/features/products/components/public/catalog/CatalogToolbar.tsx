interface CatalogToolbarProps {
    searchTerm:
        string;

    resultLabel:
        string;

    hasSearch:
        boolean;

    onSearchChange:
        (
            value:
                string,
        ) => void;

    onClearSearch:
        () => void;
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
                <span className="catalog-search-label">
                    Buscar
                    producto
                </span>

                <span className="catalog-search-control">
                    <input
                        className="catalog-search-input"
                        type="search"
                        value={
                            searchTerm
                        }
                        placeholder="Ej. termómetro, balanza o pH"
                        onChange={(
                            event,
                        ) => {
                            onSearchChange(
                                event.target.value,
                            );
                        }}
                    />

                    {
                        hasSearch && (
                            <button
                                className="catalog-search-clear"
                                type="button"
                                aria-label="Limpiar búsqueda"
                                onClick={
                                    onClearSearch
                                }
                            >
                                ×
                            </button>
                        )
                    }
                </span>
            </label>

            <p
                className="catalog-result-count"
                aria-live="polite"
            >
                Mostrando{" "}

                <strong>
                    {
                        resultLabel
                    }
                </strong>
            </p>
        </div>
    );
}
