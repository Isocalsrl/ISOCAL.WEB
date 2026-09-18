import { useCallback, useEffect, useMemo, useState } from "react";
import { productIdListsAreEqual, type PersistedProductIdsStorage } from "../storage/persistedProductIds";

export function usePersistedProductIds(
    storage: PersistedProductIdsStorage,
) {
    const [productIds, setProductIds] = useState<number[]>(storage.read);

    useEffect(() => {
        storage.write(productIds);
    }, [productIds, storage]);

    useEffect(() => {
        function handleStorage(event: StorageEvent): void {
            if (event.key !== storage.storageKey) {
                return;
            }

            const nextProductIds = storage.parse(event.newValue);

            setProductIds((currentProductIds) =>
                productIdListsAreEqual(currentProductIds, nextProductIds)
                    ? currentProductIds
                    : nextProductIds,
            );
        }

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, [storage]);

    const productIdSet = useMemo(() => new Set(productIds), [productIds]);

    const has = useCallback(
        (productId: number): boolean => productIdSet.has(productId),
        [productIdSet],
    );

    const add = useCallback((productId: number): void => {
        setProductIds((currentProductIds) =>
            currentProductIds.includes(productId)
                ? currentProductIds
                : [...currentProductIds, productId],
        );
    }, []);

    const remove = useCallback((productId: number): void => {
        setProductIds((currentProductIds) =>
            currentProductIds.filter(
                (currentProductId) => currentProductId !== productId,
            ),
        );
    }, []);

    const toggle = useCallback((productId: number): void => {
        setProductIds((currentProductIds) =>
            currentProductIds.includes(productId)
                ? currentProductIds.filter(
                      (currentProductId) => currentProductId !== productId,
                  )
                : [...currentProductIds, productId],
        );
    }, []);

    const clear = useCallback((): void => {
        setProductIds((currentProductIds) =>
            currentProductIds.length === 0 ? currentProductIds : [],
        );
    }, []);

    const retainAvailable = useCallback(
        (availableProductIds: readonly number[]): void => {
            const availableProductIdSet = new Set(availableProductIds);

            setProductIds((currentProductIds) => {
                const nextProductIds = currentProductIds.filter((productId) =>
                    availableProductIdSet.has(productId),
                );

                return productIdListsAreEqual(
                    currentProductIds,
                    nextProductIds,
                )
                    ? currentProductIds
                    : nextProductIds;
            });
        },
        [],
    );

    return {
        productIds,
        count: productIds.length,
        has,
        add,
        remove,
        toggle,
        clear,
        retainAvailable,
    };
}
