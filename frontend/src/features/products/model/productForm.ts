export interface ProductFormState {
    name: string;
    slug: string;
    description: string;
    categoryId: string;
}

export const EMPTY_PRODUCT_FORM:
    ProductFormState = {
        name: "",
        slug: "",
        description: "",
        categoryId: "",
    };

export const MAX_PRODUCT_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_PRODUCT_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateProductForm(
    form: ProductFormState,
    imageFile: File | null,
    hasExistingImage: boolean,
): string | null {
    if (!form.name.trim()) {
        return "El nombre del producto es obligatorio.";
    }

    if (!form.slug.trim()) {
        return "El identificador URL es obligatorio.";
    }

    if (
        !/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/
            .test(form.slug.trim())
    ) {
        return "El identificador URL solo admite letras, números y guiones simples.";
    }

    if (!imageFile && !hasExistingImage) return "La imagen principal del producto es obligatoria.";
    if (imageFile && !ALLOWED_PRODUCT_IMAGE_TYPES.has(imageFile.type)) return "La imagen debe estar en formato JPG, PNG o WEBP.";
    if (imageFile && imageFile.size > MAX_PRODUCT_IMAGE_SIZE_BYTES) return "La imagen no puede superar los 5 MB.";
    if (imageFile && imageFile.size <= 0) return "La imagen seleccionada está vacía.";

    return null;
}
