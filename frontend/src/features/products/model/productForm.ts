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

export function validateProductForm(
    form:
        ProductFormState,
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

    return null;
}
