import {
    useState,
} from "react";

import {
    toSlug,
} from "../../../shared/utils/toSlug";

import {
    EMPTY_CATEGORY_FORM,
    type CategoryFormState,
} from "../model/categoryForm";

import type {
    Category,
} from "../types/category.types";

export function useCategoryEditor() {
    const [
        form,
        setForm,
    ] = useState<CategoryFormState>(
        EMPTY_CATEGORY_FORM,
    );

    const [
        categoryBeingEdited,
        setCategoryBeingEdited,
    ] = useState<Category | null>(null);

    const [
        slugWasEdited,
        setSlugWasEdited,
    ] = useState(false);

    function resetForm(): void {
        setForm(
            EMPTY_CATEGORY_FORM,
        );
        setCategoryBeingEdited(
            null,
        );
        setSlugWasEdited(
            false,
        );
    }

    function startEditing(
        category:
            Category,
    ): void {
        setCategoryBeingEdited(
            category,
        );
        setForm({
            name: category.name,
            slug: category.slug,
            description:
                category.description ?? "",
        });
        setSlugWasEdited(
            true,
        );
    }

    function updateName(
        name:
            string,
    ): void {
        setForm(
            (
                currentForm,
            ) => ({
                ...currentForm,
                name,
                slug: slugWasEdited
                    ? currentForm.slug
                    : toSlug(name),
            }),
        );
    }

    function updateSlug(
        value:
            string,
    ): void {
        setSlugWasEdited(
            true,
        );
        setForm(
            (
                currentForm,
            ) => ({
                ...currentForm,
                slug: toSlug(
                    value,
                ),
            }),
        );
    }

    function updateDescription(
        description:
            string,
    ): void {
        setForm(
            (
                currentForm,
            ) => ({
                ...currentForm,
                description,
            }),
        );
    }

    function syncEditedCategory(
        category:
            Category,
    ): void {
        setCategoryBeingEdited(
            (
                currentCategory,
            ) =>
                currentCategory?.id ===
                category.id
                    ? category
                    : currentCategory,
        );
    }

    return {
        form,
        categoryBeingEdited,
        resetForm,
        startEditing,
        updateName,
        updateSlug,
        updateDescription,
        syncEditedCategory,
    };
}
