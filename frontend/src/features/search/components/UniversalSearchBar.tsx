import { useEffect, useId, useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";
import { useDebouncedValue } from "../../../shared/hooks/useDebouncedValue";
import { useTechnicalSearch } from "../hooks/useTechnicalSearch";
import type { TechnicalSearchResultKind } from "../model/technicalSearch";

interface UniversalSearchBarProps {
    initialValue?: string;
    compact?: boolean;
    autoFocus?: boolean;
    liveResults?: boolean;
    onNavigate?: () => void;
}

const KIND_LABEL: Record<TechnicalSearchResultKind, string> = {
    product: "Producto",
    category: "Categoría",
    service: "Servicio",
    tool: "Herramienta",
    article: "Artículo",
};

const KIND_ICON: Record<TechnicalSearchResultKind, "package" | "layers" | "ruler" | "search" | "book"> = {
    product: "package",
    category: "layers",
    service: "ruler",
    tool: "search",
    article: "book",
};

export function UniversalSearchBar({
    initialValue = "",
    compact = false,
    autoFocus = false,
    liveResults = true,
    onNavigate,
}: UniversalSearchBarProps) {
    const navigate = useNavigate();
    const inputId = useId();
    const listboxId = `${inputId}-results`;
    const [query, setQuery] = useState(initialValue);
    const [focused, setFocused] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const debouncedQuery = useDebouncedValue(query.trim(), 220);
    const search = useTechnicalSearch(liveResults ? debouncedQuery : "");
    const suggestions = useMemo(() => search.results.slice(0, 6), [search.results]);
    const canSuggest = liveResults && query.trim().length >= 2;
    const showResults = focused && canSuggest;

    useEffect(() => {
        setQuery(initialValue);
    }, [initialValue]);

    useEffect(() => {
        setActiveIndex(-1);
    }, [debouncedQuery]);

    function goTo(href: string) {
        setFocused(false);
        setActiveIndex(-1);
        onNavigate?.();
        navigate(href);
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const value = query.trim();
        if (!value) return;

        if (activeIndex >= 0 && suggestions[activeIndex]) {
            goTo(suggestions[activeIndex].href);
            return;
        }

        setFocused(false);
        onNavigate?.();
        navigate(`/buscar?q=${encodeURIComponent(value)}`);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (!showResults) return;

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((current) => Math.min(current + 1, suggestions.length - 1));
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((current) => Math.max(current - 1, -1));
        } else if (event.key === "Escape") {
            setFocused(false);
            setActiveIndex(-1);
        }
    }

    const waitingForDebounce = query.trim() !== debouncedQuery;
    const isLoading = canSuggest && (waitingForDebounce || search.isLoading);

    return (
        <form
            className={`technical-search-bar${compact ? " technical-search-bar-compact" : ""}${showResults ? " is-expanded" : ""}`}
            onSubmit={submit}
            onFocus={() => setFocused(true)}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setFocused(false);
                    setActiveIndex(-1);
                }
            }}
            role="search"
        >
            <CorporateIcon name="search" />
            <label className="sr-only" htmlFor={inputId}>
                Buscar productos, servicios o magnitudes
            </label>
            <input
                id={inputId}
                type="search"
                value={query}
                autoFocus={autoFocus}
                autoComplete="off"
                spellCheck={false}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={showResults}
                aria-controls={showResults ? listboxId : undefined}
                aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
                onKeyDown={handleKeyDown}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ej.: manómetro, balanza, temperatura, 0–300 PSI"
            />
            <button type="submit">
                Buscar <CorporateIcon name="arrow" />
            </button>

            {showResults ? (
                <div className="technical-search-live" id={listboxId} role="listbox" aria-label="Resultados sugeridos">
                    <div className="technical-search-live-head">
                        <span>Coincidencias en ISOCAL</span>
                        {!isLoading && suggestions.length > 0 ? <small>{search.results.length} relacionadas</small> : null}
                    </div>

                    {isLoading ? (
                        <div className="technical-search-live-loading" role="status" aria-live="polite">
                            <span className="sr-only">Buscando coincidencias.</span>
                            {Array.from({ length: 3 }, (_, index) => (
                                <div className="technical-search-live-skeleton" key={index} aria-hidden="true">
                                    <span />
                                    <div><i /><i /></div>
                                </div>
                            ))}
                        </div>
                    ) : suggestions.length > 0 ? (
                        <div className="technical-search-live-list">
                            {suggestions.map((result, index) => (
                                <Link
                                    id={`${listboxId}-${index}`}
                                    role="option"
                                    aria-selected={index === activeIndex}
                                    className={`technical-search-live-item${index === activeIndex ? " is-active" : ""}`}
                                    key={result.id}
                                    to={result.href}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onClick={() => {
                                        setFocused(false);
                                        onNavigate?.();
                                    }}
                                >
                                    <span className="technical-search-live-icon" aria-hidden="true">
                                        <CorporateIcon name={KIND_ICON[result.kind]} />
                                    </span>
                                    <span className="technical-search-live-copy">
                                        <small>{KIND_LABEL[result.kind]} · {result.eyebrow}</small>
                                        <strong>{result.title}</strong>
                                        <span>{result.description}</span>
                                    </span>
                                    <CorporateIcon name="arrow" />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="technical-search-live-empty" role="status">
                            <span className="technical-search-live-icon" aria-hidden="true"><CorporateIcon name="search" /></span>
                            <div>
                                <strong>No vemos una coincidencia directa.</strong>
                                <span>Abre la búsqueda completa para probar términos relacionados.</span>
                            </div>
                        </div>
                    )}

                    <button className="technical-search-live-all" type="submit">
                        Ver todos los resultados para “{query.trim()}” <CorporateIcon name="arrow" />
                    </button>
                </div>
            ) : null}
        </form>
    );
}
