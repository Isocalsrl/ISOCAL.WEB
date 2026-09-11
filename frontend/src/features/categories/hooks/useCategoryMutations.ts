import {
    useState,
} from "react";

import {
    ApiError,
} from "../../../shared/api/httpClient";

import * as categoriesApi from "../api/categories.api";

import {
    validateCategoryForm,
    type CategoryFormState,
} from "../model/categoryForm";

import type {
    Category,
} from "../types/category.types";

interface UseCategoryMutationsOptions {
    isSuperAdmin: boolean;
    form: CategoryFormState;
    categoryBeingEdited: Category | null;
    addCategory: (category: Category) => void;
    replaceCategory: (category: Category, shouldSort?: boolean) => void;
    removeCategory: (categoryId: number) => void;
    resetForm: () => void;
    syncEditedCategory: (category: Category) => void;
}

export function useCategoryMutations({
    isSuperAdmin,
    form,
    categoryBeingEdited,
    addCategory,
    replaceCategory,
    removeCategory,
    resetForm,
    syncEditedCategory,
}: UseCategoryMutationsOptions) {
    const [categoryToDeactivate, setCategoryToDeactivate] =
        useState<Category | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeactivating, setIsDeactivating] = useState(false);
    const [reactivatingCategoryId, setReactivatingCategoryId] = useState<
        number | null
    >(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    function clearMessages(): void {
        setErrorMessage(null);
        setSuccessMessage(null);
    }

    async function saveCategory(): Promise<void> {
        clearMessages();

        const validationMessage = validateCategoryForm(form);
        if (validationMessage) {
            setErrorMessage(validationMessage);
            return;
        }

        setIsSubmitting(true);

        const input = {
            name: form.name.trim(),
            slug: form.slug.trim(),
            description: form.description.trim() || null,
        };

        try {
            if (categoryBeingEdited) {
                const updatedCategory = await categoriesApi.updateCategory(
                    categoryBeingEdited.id,
                    input,
                );
                replaceCategory(updatedCategory);
                setSuccessMessage("Categoría actualizada correctamente.");
            } else {
                const createdCategory = await categoriesApi.createCategory(
                    input,
                );
                addCategory(createdCategory);
                setSuccessMessage("Categoría creada correctamente.");
            }

            resetForm();
        } catch (error) {
            setErrorMessage(
                error instanceof ApiError
                    ? error.message
                    : "No se pudo guardar la categoría.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    async function deactivateCategory(): Promise<void> {
        if (!categoryToDeactivate) {
            return;
        }

        clearMessages();
        setIsDeactivating(true);

        try {
            const deactivatedCategory =
                await categoriesApi.deactivateCategory(
                    categoryToDeactivate.id,
                );

            if (isSuperAdmin) {
                replaceCategory(deactivatedCategory, false);
            } else {
                removeCategory(categoryToDeactivate.id);
            }

            if (categoryBeingEdited?.id === categoryToDeactivate.id) {
                resetForm();
            }

            setSuccessMessage("Categoría desactivada correctamente.");
        } catch (error) {
            setErrorMessage(
                error instanceof ApiError
                    ? error.message
                    : "No se pudo desactivar la categoría.",
            );
        } finally {
            setCategoryToDeactivate(null);
            setIsDeactivating(false);
        }
    }

    async function reactivateCategory(category: Category): Promise<void> {
        clearMessages();
        setReactivatingCategoryId(category.id);

        try {
            const reactivatedCategory = await categoriesApi.reactivateCategory(
                category.id,
            );
            replaceCategory(reactivatedCategory);
            syncEditedCategory(reactivatedCategory);
            setSuccessMessage("Categoría reactivada correctamente.");
        } catch (error) {
            setErrorMessage(
                error instanceof ApiError
                    ? error.message
                    : "No se pudo reactivar la categoría.",
            );
        } finally {
            setReactivatingCategoryId(null);
        }
    }

    return {
        categoryToDeactivate,
        isSubmitting,
        isDeactivating,
        reactivatingCategoryId,
        errorMessage,
        successMessage,
        clearMessages,
        saveCategory,
        requestDeactivate: setCategoryToDeactivate,
        cancelDeactivate: () => setCategoryToDeactivate(null),
        deactivateCategory,
        reactivateCategory,
    };
}
