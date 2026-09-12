import type {
    Category,
} from "../types/category.types";

import {
    useCategoriesCollection,
} from "./useCategoriesCollection";

import {
    useCategoryEditor,
} from "./useCategoryEditor";

import {
    useCategoryMutations,
} from "./useCategoryMutations";

export function useCategoriesManagement(
    isSuperAdmin: boolean,
) {
    const collection = useCategoriesCollection();
    const editor = useCategoryEditor();
    const mutations = useCategoryMutations({
        isSuperAdmin,
        form: editor.form,
        categoryBeingEdited: editor.categoryBeingEdited,
        addCategory: collection.addCategory,
        replaceCategory: collection.replaceCategory,
        removeCategory: collection.removeCategory,
        resetForm: editor.resetForm,
        syncEditedCategory: editor.syncEditedCategory,
    });

    function editCategory(category: Category): void {
        editor.startEditing(category);
        mutations.clearMessages();
    }

    return {
        categories: collection.categories,
        form: editor.form,
        categoryBeingEdited: editor.categoryBeingEdited,
        categoryToDeactivate: mutations.categoryToDeactivate,
        isLoading: collection.isLoading,
        isSubmitting: mutations.isSubmitting,
        isDeactivating: mutations.isDeactivating,
        reactivatingCategoryId: mutations.reactivatingCategoryId,
        errorMessage:
            collection.loadErrorMessage ?? mutations.errorMessage,
        hasLoadError: collection.loadErrorMessage !== null,
        successMessage: mutations.successMessage,
        loadCategories: collection.loadCategories,
        resetForm: editor.resetForm,
        editCategory,
        updateName: editor.updateName,
        updateSlug: editor.updateSlug,
        updateDescription: editor.updateDescription,
        saveCategory: mutations.saveCategory,
        requestDeactivate: mutations.requestDeactivate,
        cancelDeactivate: mutations.cancelDeactivate,
        deactivateCategory: mutations.deactivateCategory,
        reactivateCategory: mutations.reactivateCategory,
    };
}
