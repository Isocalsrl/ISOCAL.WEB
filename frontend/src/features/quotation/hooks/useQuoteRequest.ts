import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../../../shared/api/httpClient";
import { createPublicQuote } from "../api/quotes.api";
import {
    createInitialQuoteRequestForm,
    reconcileQuoteRequestItems,
    toCreateQuoteRequestPayload,
    validateQuoteRequestForm,
} from "../model/quoteRequestForm";
import type {
    QuoteRequestCustomerField,
    QuoteRequestFormValues,
    QuoteRequestReceipt,
    UseQuoteRequestOptions,
} from "../types/quoteRequest.types";

function getRequestErrorMessage(error: unknown): string {
    if (error instanceof ApiError && error.code === "QUOTE_PRODUCTS_UNAVAILABLE") {
        return "Uno o más productos dejaron de estar disponibles. Actualiza la página y revisa tu selección.";
    }
    if (error instanceof ApiError && error.code === "QUOTE_RATE_LIMITED") {
        return "Se alcanzó temporalmente el límite de solicitudes. Inténtalo nuevamente más tarde.";
    }
    if (error instanceof ApiError && error.code === "NETWORK_ERROR") {
        return "No pudimos conectar con ISOCAL. Revisa tu conexión e inténtalo nuevamente.";
    }
    if (error instanceof ApiError) return error.message;
    return "Ocurrió un error inesperado al registrar la solicitud.";
}

export function useQuoteRequest({ products, onSuccess }: UseQuoteRequestOptions) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [receipt, setReceipt] = useState<QuoteRequestReceipt | null>(null);
    const [form, setForm] = useState<QuoteRequestFormValues>(() =>
        createInitialQuoteRequestForm(products),
    );

    useEffect(() => {
        if (!isOpen) return;

        let isActive = true;
        queueMicrotask(() => {
            if (!isActive) return;
            setForm((current) => ({
                ...current,
                items: reconcileQuoteRequestItems(current.items, products),
            }));
        });

        return () => {
            isActive = false;
        };
    }, [isOpen, products]);

    const openRequest = useCallback(() => {
        if (isOpen) return;
        setErrorMessage(null);
        setForm(createInitialQuoteRequestForm(products));
        setIsOpen(true);
    }, [isOpen, products]);

    const closeRequest = useCallback(() => {
        if (isSubmitting) return;
        setErrorMessage(null);
        setIsOpen(false);
    }, [isSubmitting]);

    const updateCustomerField = useCallback(
        (field: QuoteRequestCustomerField, value: string) => {
            setForm((current) => ({ ...current, [field]: value }));
        },
        [],
    );

    const updateItem = useCallback(
        (productId: number, field: "quantity" | "notes", value: string) => {
            setForm((current) => ({
                ...current,
                items: current.items.map((item) =>
                    item.productId === productId
                        ? { ...item, [field]: value }
                        : item,
                ),
            }));
        },
        [],
    );

    const submitRequest = useCallback(async () => {
        if (isSubmitting) return;
        setErrorMessage(null);

        const validationError = validateQuoteRequestForm(form);
        if (validationError) {
            setErrorMessage(validationError);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await createPublicQuote(
                toCreateQuoteRequestPayload(form),
            );
            setReceipt(response.quote);
            setIsOpen(false);
            onSuccess();
        } catch (error) {
            setErrorMessage(getRequestErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    }, [form, isSubmitting, onSuccess]);

    return {
        isOpen,
        isSubmitting,
        errorMessage,
        receipt,
        form,
        openRequest,
        closeRequest,
        updateCustomerField,
        updateItem,
        submitRequest,
    };
}

export type QuoteRequestState = ReturnType<typeof useQuoteRequest>;
