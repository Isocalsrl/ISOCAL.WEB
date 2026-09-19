import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiError } from "../../../shared/api/httpClient";
import * as productsApi from "../api/products.api";
import { validateProductForm } from "../model/productForm";
import { useProductEditor } from "./useProductEditor";
import { useProductFormData } from "./useProductFormData";
import { useProductImage } from "./useProductImage";

export function useProductForm() {
    const {productId} = useParams();
    const navigate = useNavigate();
    const isEditing = productId !== undefined;
    const numericProductId = Number(productId);

    const editor = useProductEditor(isEditing);
    const image = useProductImage();
    const {hydrateProduct} = editor;
    const {hydrateExistingImage} = image;
    const data = useProductFormData({
        isEditing,
        productId: numericProductId,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!data.product) {
            return;
        }

        hydrateProduct(data.product);
        hydrateExistingImage(data.product.imageUrl);
    }, [data.product, hydrateProduct, hydrateExistingImage]);

    async function submit(): Promise<void> {
        setSubmitErrorMessage(null);

        const validationMessage = validateProductForm(
            editor.form,
            image.imageFile,
            Boolean(image.existingImageUrl),
        );

        if (validationMessage) {
            setSubmitErrorMessage(validationMessage);
            return;
        }

        setIsSubmitting(true);

        const fields = {
            name: editor.form.name.trim(),
            slug: editor.form.slug.trim(),
            description: editor.form.description.trim() || null,
            categoryId: editor.form.categoryId ? Number(editor.form.categoryId) : null,
        };

        try {
            if (isEditing) {
                await productsApi.updateProduct(numericProductId, {
                    ...fields,
                    ...(image.imageFile ? { image: image.imageFile } : {}),
                });
            } else {
                await productsApi.createProduct({
                    ...fields,
                    image: image.imageFile!,
                });
            }

            navigate("/admin/products", {
                replace: true,
                state: {
                    message: isEditing
                        ? "Producto actualizado correctamente."
                        : "Producto creado correctamente.",
                },
            });
        } catch (error) {
            setSubmitErrorMessage(
                error instanceof ApiError ? error.message : "No se pudo guardar el producto.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        form: editor.form,
        categories: data.categories,
        isEditing,
        isLoading: data.isLoading,
        isSubmitting,
        errorMessage: data.errorMessage ?? submitErrorMessage,
        updateName: editor.updateName,
        updateSlug: editor.updateSlug,
        updateCategoryId: editor.updateCategoryId,
        updateDescription: editor.updateDescription,
        imageFile: image.imageFile,
        existingImageUrl: image.existingImageUrl,
        updateImage: image.updateImage,
        submit,
        goBack: () => {
            navigate("/admin/products");
        },
    };
}
