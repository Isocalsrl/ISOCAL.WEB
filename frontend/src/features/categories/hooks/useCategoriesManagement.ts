import {
    useState,
} from "react";

import {
    ApiError,
} from "../../../shared/api/httpClient";

import * as categoriesApi
    from "../api/categories.api";

import {
    validateCategoryForm,
} from "../model/categoryForm";

import type {
    Category,
} from "../types/category.types";

import {
    useCategoriesCollection,
} from "./useCategoriesCollection";

import {
    useCategoryEditor,
} from "./useCategoryEditor";

export function useCategoriesManagement(
    isSuperAdmin:
        boolean,
) {
    const collection =
        useCategoriesCollection();

    const editor =
        useCategoryEditor();

    const [
        categoryToDeactivate,
        setCategoryToDeactivate,
    ] = useState<Category | null>(null);

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    const [
        isDeactivating,
        setIsDeactivating,
    ] = useState(false);

    const [
        reactivatingCategoryId,
        setReactivatingCategoryId,
    ] = useState<number | null>(null);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(null);

    const [
        successMessage,
        setSuccessMessage,
    ] = useState<string | null>(null);

    function clearMessages(): void {
        setErrorMessage(
            null,
        );
        setSuccessMessage(
            null,
        );
    }

    function editCategory(
        category:
            Category,
    ): void {
        editor.startEditing(
            category,
        );
        clearMessages();
    }

    async function saveCategory():
        Promise<void> {
        clearMessages();

        const validationMessage =
            validateCategoryForm(
                editor.form,
            );

        if (
            validationMessage
        ) {
            setErrorMessage(
                validationMessage,
            );
            return;
        }

        setIsSubmitting(
            true,
        );

        const input = {
            name: editor.form.name.trim(),
            slug: editor.form.slug.trim(),
            description:
                editor.form.description.trim() || null,
        };

        try {
            if (
                editor.categoryBeingEdited
            ) {
                const updatedCategory =
                    await categoriesApi
                        .updateCategory(
                            editor.categoryBeingEdited.id,
                            input,
                        );

                collection.replaceCategory(
                    updatedCategory,
                );
                setSuccessMessage(
                    "Categoría actualizada correctamente.",
                );
            } else {
                const createdCategory =
                    await categoriesApi
                        .createCategory(
                            input,
                        );

                collection.addCategory(
                    createdCategory,
                );
                setSuccessMessage(
                    "Categoría creada correctamente.",
                );
            }

            editor.resetForm();
        } catch (error) {
            setErrorMessage(
                error instanceof ApiError
                    ? error.message
                    : "No se pudo guardar la categoría.",
            );
        } finally {
            setIsSubmitting(
                false,
            );
        }
    }

    async function deactivateCategory():
        Promise<void> {
        if (
            !categoryToDeactivate
        ) {
            return;
        }

        clearMessages();
        setIsDeactivating(
            true,
        );

        try {
            const deactivatedCategory =
                await categoriesApi
                    .deactivateCategory(
                        categoryToDeactivate.id,
                    );

            if (isSuperAdmin) {
                collection.replaceCategory(
                    deactivatedCategory,
                    false,
                );
            } else {
                collection.removeCategory(
                    categoryToDeactivate.id,
                );
            }

            if (
                editor.categoryBeingEdited?.id ===
                categoryToDeactivate.id
            ) {
                editor.resetForm();
            }

            setSuccessMessage(
                "Categoría desactivada correctamente.",
            );
        } catch (error) {
            setErrorMessage(
                error instanceof ApiError
                    ? error.message
                    : "No se pudo desactivar la categoría.",
            );
        } finally {
            setCategoryToDeactivate(
                null,
            );
            setIsDeactivating(
                false,
            );
        }
    }

    async function reactivateCategory(
        category:
            Category,
    ): Promise<void> {
        clearMessages();
        setReactivatingCategoryId(
            category.id,
        );

        try {
            const reactivatedCategory =
                await categoriesApi
                    .reactivateCategory(
                        category.id,
                    );

            collection.replaceCategory(
                reactivatedCategory,
            );
            editor.syncEditedCategory(
                reactivatedCategory,
            );
            setSuccessMessage(
                "Categoría reactivada correctamente.",
            );
        } catch (error) {
            setErrorMessage(
                error instanceof ApiError
                    ? error.message
                    : "No se pudo reactivar la categoría.",
            );
        } finally {
            setReactivatingCategoryId(
                null,
            );
        }
    }

    return {
        categories:
            collection.categories,
        form: editor.form,
        categoryBeingEdited:
            editor.categoryBeingEdited,
        categoryToDeactivate,
        isLoading:
            collection.isLoading,
        isSubmitting,
        isDeactivating,
        reactivatingCategoryId,
        errorMessage:
            collection.loadErrorMessage ??
            errorMessage,
        hasLoadError:
            collection.loadErrorMessage !== null,
        successMessage,
        loadCategories:
            collection.loadCategories,
        resetForm:
            editor.resetForm,
        editCategory,
        updateName:
            editor.updateName,
        updateSlug:
            editor.updateSlug,
        updateDescription:
            editor.updateDescription,
        saveCategory,
        requestDeactivate:
            setCategoryToDeactivate,
        cancelDeactivate: () => {
            setCategoryToDeactivate(
                null,
            );
        },
        deactivateCategory,
        reactivateCategory,
    };
}
