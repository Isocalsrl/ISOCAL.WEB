import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ApiError,
} from "../../../shared/api/httpClient";

import { resolveApiUrl } from "../../../shared/api/apiUrl";

import * as categoriesApi
    from "../../categories/api/categories.api";

import type {
    Category,
} from "../../categories/types/category.types";

import * as productsApi
    from "../api/products.api";

import {
    validateProductForm,
} from "../model/productForm";

import {
    useProductEditor,
} from "./useProductEditor";

export function useProductForm() {
    const {
        productId,
    } = useParams();

    const navigate =
        useNavigate();

    const isEditing =
        productId !== undefined;

    const numericProductId =
        Number(
            productId,
        );

    const {
        form,
        hydrateProduct,
        updateName,
        updateSlug,
        updateCategoryId,
        updateDescription,
    } = useProductEditor(
        isEditing,
    );

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

    const [
        categories,
        setCategories,
    ] = useState<Category[]>([]);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(
        null,
    );

    useEffect(() => {
        let isActive = true;

        async function loadForm():
            Promise<void> {
            setErrorMessage(
                null,
            );
            setIsLoading(
                true,
            );

            try {
                if (
                    isEditing &&
                    (!Number.isInteger(
                        numericProductId,
                    ) ||
                        numericProductId <= 0)
                ) {
                    throw new Error(
                        "Identificador inválido.",
                    );
                }

                const [
                    nextCategories,
                    product,
                ] = await Promise.all([
                    categoriesApi
                        .listCategories(),
                    isEditing
                        ? productsApi
                              .getProduct(
                                  numericProductId,
                              )
                        : Promise.resolve(
                              null,
                          ),
                ]);

                if (!isActive) {
                    return;
                }

                setCategories(
                    nextCategories.filter(
                        (
                            category,
                        ) =>
                            category.isActive,
                    ),
                );

                if (product) {
                    hydrateProduct(
                        product,
                    );
                    setExistingImageUrl(resolveApiUrl(product.imageUrl));
                }
            } catch (error) {
                if (isActive) {
                    setErrorMessage(
                        error instanceof ApiError
                            ? error.message
                            : "No se pudo preparar el formulario.",
                    );
                }
            } finally {
                if (isActive) {
                    setIsLoading(
                        false,
                    );
                }
            }
        }

        void loadForm();

        return () => {
            isActive = false;
        };
    }, [
        hydrateProduct,
        isEditing,
        numericProductId,
    ]);

    async function submit():
        Promise<void> {
        setErrorMessage(
            null,
        );

        const validationMessage =
            validateProductForm(
                form,
                imageFile,
                Boolean(existingImageUrl),
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

        const fields = {
            name: form.name.trim(),
            slug: form.slug.trim(),
            description:
                form.description.trim() ||
                null,
            categoryId:
                form.categoryId
                    ? Number(
                          form.categoryId,
                      )
                    : null,
        };

        try {
                if (isEditing) {
                    await productsApi
                        .updateProduct(
                            numericProductId,
                            {
                                ...fields,
                                ...(imageFile ? { image: imageFile } : {}),
                            },
                        );
                } else {
                    await productsApi
                        .createProduct(
                            { ...fields, image: imageFile! },
                        );
            }

            navigate(
                "/admin/products",
                {
                    replace:
                        true,
                    state: {
                        message:
                            isEditing
                                ? "Producto actualizado correctamente."
                                : "Producto creado correctamente.",
                    },
                },
            );
        } catch (error) {
            setErrorMessage(
                error instanceof ApiError
                    ? error.message
                    : "No se pudo guardar el producto.",
            );
        } finally {
            setIsSubmitting(
                false,
            );
        }
    }

    return {
        form,
        categories,
        isEditing,
        isLoading,
        isSubmitting,
        errorMessage,
        updateName,
        updateSlug,
        updateCategoryId,
        updateDescription,
        imageFile,
        existingImageUrl,
        updateImage: setImageFile,
        submit,
        goBack: () => {
            navigate(
                "/admin/products",
            );
        },
    };
}
