import { useCallback, useState } from "react";
import { toSlug } from "../../../shared/utils/toSlug";
import { EMPTY_PRODUCT_FORM, type ProductFormState } from "../model/productForm";
import type { Product } from "../types/product.types";

export function useProductEditor(
    isEditing:
        boolean,
) {
    const [
        form,
        setForm,
    ] = useState<ProductFormState>(
        EMPTY_PRODUCT_FORM,
    );

    const [
        slugWasEdited,
        setSlugWasEdited,
    ] = useState(
        isEditing,
    );

    const hydrateProduct =
        useCallback(
            (
                product:
                    Product,
            ): void => {
                setForm({
                    name: product.name,
                    slug: product.slug,
                    description:
                        product.description ?? "",
                    categoryId:
                        product.categoryId
                            ?.toString() ?? "",
                });
            },
            [],
        );

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
                slug:
                    slugWasEdited
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

    function updateCategoryId(
        categoryId:
            string,
    ): void {
        setForm(
            (
                currentForm,
            ) => ({
                ...currentForm,
                categoryId,
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

    return {
        form,
        hydrateProduct,
        updateName,
        updateSlug,
        updateCategoryId,
        updateDescription,
    };
}
