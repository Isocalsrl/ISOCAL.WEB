import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { resolveApiUrl } from "../../../shared/api/apiUrl";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";
import { ProgressiveImage } from "../../../shared/components/media/ProgressiveImage";
import type { AssistantFact, AssistantResourceCard } from "../model/assistant.types";
import { useVirtualAssistant } from "../hooks/useVirtualAssistant";
import "../styles/assistant.css";

function AssistantRobotIcon() {
    return (
        <svg
            className="ix-assistant-robot-icon"
            viewBox="0 0 32 32"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M16 5.25V3" />
            <circle cx="16" cy="3" r="1.5" />
            <rect x="7" y="8" width="18" height="15" rx="5.25" />
            <path d="M7 14H4.5M27.5 14H25" />
            <path d="M12 25.5v2.25M20 25.5v2.25" />
            <circle cx="12.5" cy="15" r="1.4" />
            <circle cx="19.5" cy="15" r="1.4" />
            <path d="M12 19.25c1.05.75 2.48 1.15 4 1.15 1.52 0 2.95-.4 4-1.15" />
        </svg>
    );
}

function confidenceTone(confidence: number | undefined): "high" | "medium" | "low" {
    if ((confidence ?? 0) >= 90) return "high";
    if ((confidence ?? 0) >= 75) return "medium";
    return "low";
}

function cardIcon(kind: AssistantResourceCard["kind"]) {
    switch (kind) {
        case "product": return "package";
        case "service": return "ruler";
        case "tool": return "search";
        case "article": return "book";
        case "contact": return "phone";
        case "process": return "clipboard";
        case "page": return "layers";
        case "category": return "layers";
        case "company":
        default: return "info";
    }
}

function FactPill({fact}: { fact: AssistantFact }) {
    return (
        <div className="ix-assistant-fact-pill">
            {fact.icon ? <span className="ix-assistant-fact-icon"><CorporateIcon name={fact.icon} /></span> : null}
            <div>
                <small>{fact.label}</small>
                <strong>{fact.value}</strong>
            </div>
        </div>
    );
}

function ResourceCard({ card, onNavigate }: { card: AssistantResourceCard; onNavigate: () => void }) {
    const imageUrl = resolveApiUrl(card.imageUrl);
    return (
        <Link className="ix-assistant-resource-card" to={card.href} onClick={onNavigate}>
            <div className="ix-assistant-resource-card-main">
                {imageUrl ? (
                    <div className="ix-assistant-resource-card-media">
                        <ProgressiveImage src={imageUrl} alt="" loading="lazy" />
                    </div>
                ) : (
                    <div className="ix-assistant-resource-card-media is-fallback" aria-hidden="true">
                        <CorporateIcon name={cardIcon(card.kind)} />
                    </div>
                )}
                <div className="ix-assistant-resource-card-copy">
                    {card.eyebrow ? <span className="ix-assistant-resource-card-eyebrow">{card.eyebrow}</span> : null}
                    <strong>{card.title}</strong>
                    <p>{card.description}</p>
                    <div className="ix-assistant-resource-card-footer">
                        {card.meta ? <small>{card.meta}</small> : <small>&nbsp;</small>}
                        <span>{card.ctaLabel ?? "Abrir"} <CorporateIcon name="arrow" /></span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export function VirtualAssistant() {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [showLauncherPrompt, setShowLauncherPrompt] = useState(true);
    const { messages, suggestions, isLoadingKnowledge, isAnswering, answerPhase, preload, send, reset } = useVirtualAssistant();
    const panelId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const launcherRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;
        preload();
        inputRef.current?.focus();
    }, [open, preload]);

    useEffect(() => {
        if (!showLauncherPrompt) return;
        const timeoutId = window.setTimeout(() => setShowLauncherPrompt(false), 9000);
        return () => window.clearTimeout(timeoutId);
    }, [showLauncherPrompt]);

    useEffect(() => {
        if (!open) return;
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, isAnswering, open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            setOpen(false);
            launcherRef.current?.focus();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    async function submit(event: FormEvent) {
        event.preventDefault();
        const query = input.trim();
        if (!query) return;
        setInput("");
        await send(query);
        inputRef.current?.focus();
    }

    async function useSuggestion(value: string) {
        if (isAnswering) return;
        await send(value);
        inputRef.current?.focus();
    }

    return (
        <>
            {open && (
                <section id={panelId} className="ix-assistant-panel" role="dialog" aria-label="Asistente técnico de ISOCAL">
                    <header className="ix-assistant-header">
                        <div className="ix-assistant-brand">
                            <span className="ix-assistant-brand-icon"><AssistantRobotIcon /></span>
                            <div>
                                <strong>Asistente técnico</strong>
                                <span>
                                    <i aria-hidden="true" />
                                    {isLoadingKnowledge ? "Actualizando contenido…" : "Contenido ISOCAL verificado"}
                                </span>
                            </div>
                        </div>
                        <div className="ix-assistant-header-actions">
                            <button type="button" onClick={reset} title="Reiniciar conversación" aria-label="Reiniciar conversación">
                                <span aria-hidden="true">↻</span>
                            </button>
                            <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar asistente">
                                <CorporateIcon name="close" />
                            </button>
                        </div>
                    </header>

                    <div className="ix-assistant-messages" ref={scrollRef} aria-live="polite">
                        {messages.map((message) => {
                            const visibleFacts = message.facts?.slice(0, 4) ?? [];
                            const visibleCards = message.cards?.slice(0, 2) ?? [];
                            const showTopline = message.role === "assistant";

                            return (
                                <article key={message.id} className={`ix-assistant-message is-${message.role}`}>
                                    {showTopline ? (
                                        <div className="ix-assistant-message-topline">
                                            <span className="ix-assistant-message-role">Asistente técnico</span>
                                            {message.confidence !== undefined ? (
                                                <span className={`ix-assistant-confidence-pill is-${confidenceTone(message.confidence)}`}>
                                                    <CorporateIcon name="shield" />
                                                    Confianza {message.confidence}%
                                                </span>
                                            ) : null}
                                        </div>
                                    ) : null}

                                    <div className="ix-assistant-bubble">
                                        {message.role === "assistant" ? (
                                            <ReactMarkdown allowedElements={["p", "strong", "em", "ul", "ol", "li"]} unwrapDisallowed>
                                                {message.text}
                                            </ReactMarkdown>
                                        ) : <p>{message.text}</p>}

                                        {visibleFacts.length > 0 ? (
                                            <div className="ix-assistant-facts-grid">
                                                {visibleFacts.map((fact) => <FactPill key={`${message.id}-${fact.label}`} fact={fact} />)}
                                            </div>
                                        ) : null}

                                        {visibleCards.length > 0 ? (
                                            <div className="ix-assistant-resource-list">
                                                {visibleCards.map((card) => (
                                                    <ResourceCard key={`${message.id}-${card.id}`} card={card} onNavigate={() => setOpen(false)} />
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>

                                    {message.links && message.links.length > 0 ? (
                                        <div className="ix-assistant-links">
                                            {message.links.slice(0, 3).map((link) => (
                                                <Link key={`${message.id}-${link.href}`} className={link.kind === "primary" ? "is-primary" : ""} to={link.href} onClick={() => setOpen(false)}>
                                                    {link.label} <CorporateIcon name="arrow" />
                                                </Link>
                                            ))}
                                        </div>
                                    ) : null}
                                </article>
                            );
                        })}
                        {isAnswering && (
                            <div className="ix-assistant-thinking" role="status" aria-live="polite">
                                <span className="ix-assistant-thinking-avatar" aria-hidden="true"><AssistantRobotIcon /></span>
                                <div className="ix-assistant-thinking-copy">
                                    <small>{answerPhase === "typing" ? "Escribiendo respuesta" : "Revisando contenido ISOCAL"}</small>
                                    <div className="ix-assistant-thinking-dots" aria-hidden="true"><span /><span /><span /></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {suggestions.length > 0 && !isAnswering ? (
                        <div className="ix-assistant-suggestions" aria-label="Preguntas sugeridas">
                            <div className="ix-assistant-suggestions-title">
                                <CorporateIcon name="search" />
                                <span>Preguntas sugeridas</span>
                            </div>
                            <div className="ix-assistant-suggestions-list">
                                {suggestions.map((suggestion) => (
                                    <button type="button" key={suggestion} onClick={() => void useSuggestion(suggestion)}>{suggestion}</button>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <form className="ix-assistant-form" onSubmit={(event) => void submit(event)}>
                        <label htmlFor={`${panelId}-input`} className="sr-only">Escribe tu consulta</label>
                        <div className="ix-assistant-form-field">
                            <input
                                id={`${panelId}-input`}
                                ref={inputRef}
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                maxLength={500}
                                autoComplete="off"
                                placeholder="Ej.: ¿calibran manómetros de 0–300 PSI?"
                                disabled={isAnswering}
                            />
                            <small>Escribe tu consulta o toca una sugerencia.</small>
                        </div>
                        <button type="submit" disabled={!input.trim() || isAnswering} aria-label="Enviar consulta">
                            <CorporateIcon name="arrow" />
                        </button>
                    </form>
                    <footer className="ix-assistant-footer">Respuestas basadas en contenido publicado por ISOCAL.</footer>
                </section>
            )}

            <div className="ix-assistant-launcher-wrap">
                {!open && showLauncherPrompt ? (
                    <div className="ix-assistant-nudge" role="status">
                        <strong>Hola, ¿puedo ayudarte?</strong>
                        <span>Pregúntame por productos, calibración, servicios o contacto.</span>
                    </div>
                ) : null}
                <button
                    ref={launcherRef}
                    type="button"
                    className={`ix-assistant-launcher${open ? " is-open" : ""}`}
                    aria-expanded={open}
                    aria-controls={panelId}
                    aria-label={open ? "Cerrar asistente técnico" : "Abrir asistente técnico de ISOCAL"}
                    onClick={() => {
                        setShowLauncherPrompt(false);
                        setOpen((value) => !value);
                    }}
                >
                    {open ? <CorporateIcon name="close" /> : <AssistantRobotIcon />}
                </button>
            </div>
        </>
    );
}
