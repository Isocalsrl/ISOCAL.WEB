import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import {
    QUOTATION_STORAGE_KEY,
} from "../constants/quotation.constants";

import {
    parseQuotationProductIds,
    readQuotationProductIds,
    writeQuotationProductIds,
} from "../storage/quotation.storage";

import {
    QuotationContext,
    type QuotationContextValue,
} from "./quotation.context";

interface QuotationProviderProps {
    children: ReactNode;
}

function productIdListsAreEqual(
    first:
        readonly number[],
    second:
        readonly number[],
): boolean {
    return (
        first.length ===
            second.length &&
        first.every(
            (
                productId,
                index,
            ) =>
                productId ===
                second[index],
        )
    );
}

export function QuotationProvider({
    children,
}: QuotationProviderProps) {
    const [
        quotationProductIds,
        setQuotationProductIds,
    ] = useState<number[]>(
        readQuotationProductIds,
    );

    useEffect(() => {
        writeQuotationProductIds(
            quotationProductIds,
        );
    }, [
        quotationProductIds,
    ]);

    useEffect(() => {
        function handleStorage(
            event: StorageEvent,
        ): void {
            if (
                event.key !==
                QUOTATION_STORAGE_KEY
            ) {
                return;
            }

            const nextProductIds =
                parseQuotationProductIds(
                    event.newValue,
                );

            setQuotationProductIds(
                (
                    currentProductIds,
                ) =>
                    productIdListsAreEqual(
                        currentProductIds,
                        nextProductIds,
                    )
                        ? currentProductIds
                        : nextProductIds,
            );
        }

        window.addEventListener(
            "storage",
            handleStorage,
        );

        return () => {
            window.removeEventListener(
                "storage",
                handleStorage,
            );
        };
    }, []);

    const quotationProductIdSet =
        useMemo(
            () =>
                new Set(
                    quotationProductIds,
                ),
            [
                quotationProductIds,
            ],
        );

    const isInQuotation =
        useCallback(
            (
                productId:
                    number,
            ): boolean =>
                quotationProductIdSet.has(
                    productId,
                ),
            [
                quotationProductIdSet,
            ],
        );

    const addToQuotation =
        useCallback(
            (
                productId:
                    number,
            ): void => {
                setQuotationProductIds(
                    (
                        currentProductIds,
                    ) =>
                        currentProductIds.includes(
                            productId,
                        )
                            ? currentProductIds
                            : [
                                  ...currentProductIds,
                                  productId,
                              ],
                );
            },
            [],
        );

    const removeFromQuotation =
        useCallback(
            (
                productId:
                    number,
            ): void => {
                setQuotationProductIds(
                    (
                        currentProductIds,
                    ) =>
                        currentProductIds.filter(
                            (
                                currentProductId,
                            ) =>
                                currentProductId !==
                                productId,
                        ),
                );
            },
            [],
        );

    const toggleQuotation =
        useCallback(
            (
                productId:
                    number,
            ): void => {
                setQuotationProductIds(
                    (
                        currentProductIds,
                    ) =>
                        currentProductIds.includes(
                            productId,
                        )
                            ? currentProductIds.filter(
                                  (
                                      currentProductId,
                                  ) =>
                                      currentProductId !==
                                      productId,
                              )
                            : [
                                  ...currentProductIds,
                                  productId,
                              ],
                );
            },
            [],
        );

    const clearQuotation =
        useCallback(
            (): void => {
                setQuotationProductIds(
                    (
                        currentProductIds,
                    ) =>
                        currentProductIds.length ===
                        0
                            ? currentProductIds
                            : [],
                );
            },
            [],
        );

    const retainAvailableQuotationProducts =
        useCallback(
            (
                availableProductIds:
                    readonly number[],
            ): void => {
                const availableProductIdSet =
                    new Set(
                        availableProductIds,
                    );

                setQuotationProductIds(
                    (
                        currentProductIds,
                    ) => {
                        const nextProductIds =
                            currentProductIds.filter(
                                (
                                    productId,
                                ) =>
                                    availableProductIdSet.has(
                                        productId,
                                    ),
                            );

                        return productIdListsAreEqual(
                            currentProductIds,
                            nextProductIds,
                        )
                            ? currentProductIds
                            : nextProductIds;
                    },
                );
            },
            [],
        );

    const value =
        useMemo<QuotationContextValue>(
            () => ({
                quotationProductIds,

                quotationCount:
                    quotationProductIds.length,

                isInQuotation,
                addToQuotation,
                removeFromQuotation,
                toggleQuotation,
                clearQuotation,
                retainAvailableQuotationProducts,
            }),
            [
                quotationProductIds,
                isInQuotation,
                addToQuotation,
                removeFromQuotation,
                toggleQuotation,
                clearQuotation,
                retainAvailableQuotationProducts,
            ],
        );

    return (
        <QuotationContext.Provider
            value={value}
        >
            {children}
        </QuotationContext.Provider>
    );
}