import {
    createPersistedProductIdsStorage,
} from "../../../shared/storage/persistedProductIds";

import {
    QUOTATION_STORAGE_KEY,
    QUOTATION_STORAGE_VERSION,
} from "../constants/quotation.constants";

export const quotationProductIdStorage =
    createPersistedProductIdsStorage({
        storageKey: QUOTATION_STORAGE_KEY,
        version: QUOTATION_STORAGE_VERSION,
    });

export const parseQuotationProductIds =
    quotationProductIdStorage.parse;
export const readQuotationProductIds =
    quotationProductIdStorage.read;
export const writeQuotationProductIds =
    quotationProductIdStorage.write;
