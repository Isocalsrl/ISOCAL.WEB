import { useCallback, useRef, useState } from "react";
import { getStaticAssistantKnowledge, loadAssistantKnowledge } from "../data/loadAssistantKnowledge";
import { answerAssistantQuery } from "../model/assistantEngine";
import type { AssistantConversationContext, AssistantKnowledge, AssistantMessage } from "../model/assistant.types";

const DEFAULT_SUGGESTIONS = [
    "¿Calibran manómetros?",
    "¿Qué servicio necesito para un manómetro?",
    "¿Qué productos tienen en electricidad?",
    "¿Cómo solicito una cotización?",
    "WhatsApp y contacto",
] as const;

const INITIAL_MESSAGE: AssistantMessage = {
    id: "assistant-welcome",
    role: "assistant",
    text: "Hola. Puedo ayudarte a encontrar productos, servicios, capacidades de calibración, herramientas y datos de contacto de ISOCAL.",
    confidence: 100,
};

export type AssistantAnswerPhase = "idle" | "searching" | "typing";

function messageId(role: "assistant" | "user"): string {
    return `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function wait(milliseconds: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function typingDelay(text: string): number {
    return Math.min(1250, Math.max(520, 420 + text.length * 2.35));
}

export function useVirtualAssistant() {
    const [knowledge, setKnowledge] = useState<AssistantKnowledge>(() => getStaticAssistantKnowledge());
    const [messages, setMessages] = useState<AssistantMessage[]>([INITIAL_MESSAGE]);
    const [suggestions, setSuggestions] = useState<readonly string[]>(DEFAULT_SUGGESTIONS);
    const [isLoadingKnowledge, setIsLoadingKnowledge] = useState(false);
    const [isAnswering, setIsAnswering] = useState(false);
    const [answerPhase, setAnswerPhase] = useState<AssistantAnswerPhase>("idle");
    const contextRef = useRef<AssistantConversationContext>({});
    const loadPromiseRef = useRef<Promise<AssistantKnowledge> | null>(null);
    const requestVersionRef = useRef(0);

    const ensureKnowledge = useCallback(async (): Promise<AssistantKnowledge> => {
        if (knowledge.products.length) return knowledge;
        if (loadPromiseRef.current) return loadPromiseRef.current;

        setIsLoadingKnowledge(true);
        const loadPromise = loadAssistantKnowledge().then((loaded) => {
            setKnowledge(loaded);
            return loaded;
        });
        loadPromiseRef.current = loadPromise;

        try {
            return await loadPromise;
        } finally {
            loadPromiseRef.current = null;
            setIsLoadingKnowledge(false);
        }
    }, [knowledge]);

    const preload = useCallback(() => {
        if (loadPromiseRef.current || knowledge.products.length) return;
        void ensureKnowledge();
    }, [ensureKnowledge, knowledge.products.length]);

    const send = useCallback(async (rawQuery: string) => {
        const query = rawQuery.trim().slice(0, 500);
        if (!query || isAnswering) return;

        const requestVersion = ++requestVersionRef.current;
        setMessages((current) => [...current, { id: messageId("user"), role: "user", text: query }]);
        setSuggestions([]);
        setIsAnswering(true);
        setAnswerPhase("searching");

        try {
            let activeKnowledge = knowledge;
            try {
                activeKnowledge = await ensureKnowledge();
            } catch {
                activeKnowledge = knowledge;
            }

            if (requestVersion !== requestVersionRef.current) return;

            const reply = answerAssistantQuery(query, activeKnowledge, contextRef.current);
            const contextDocument = reply.contextDocumentId
                ? activeKnowledge.documents.find((document) => document.id === reply.contextDocumentId)
                : undefined;

            contextRef.current = {
                lastIntent: reply.intent,
                lastDocumentId: reply.contextDocumentId ?? contextRef.current.lastDocumentId,
                lastProductId: contextDocument?.productId ?? contextRef.current.lastProductId,
            };

            setAnswerPhase("typing");
            await wait(typingDelay(reply.text));
            if (requestVersion !== requestVersionRef.current) return;

            setMessages((current) => [...current, {
                id: messageId("assistant"),
                role: "assistant",
                text: reply.text,
                links: reply.links,
                confidence: reply.confidence,
                facts: reply.facts,
                cards: reply.cards,
            }]);
            setSuggestions(reply.suggestions);
        } finally {
            if (requestVersion === requestVersionRef.current) {
                setIsAnswering(false);
                setAnswerPhase("idle");
            }
        }
    }, [ensureKnowledge, isAnswering, knowledge]);

    const reset = useCallback(() => {
        requestVersionRef.current += 1;
        contextRef.current = {};
        setMessages([INITIAL_MESSAGE]);
        setSuggestions(DEFAULT_SUGGESTIONS);
        setIsAnswering(false);
        setAnswerPhase("idle");
    }, []);

    return { messages, suggestions, isLoadingKnowledge, isAnswering, answerPhase, preload, send, reset };
}
