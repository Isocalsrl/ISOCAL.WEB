export interface CategoryFormState {
    name: string;
    slug: string;
    description: string;
}

export const EMPTY_CATEGORY_FORM:
    CategoryFormState = {
        name: "",
        slug: "",
        description: "",
    };

export function validateCategoryForm(
    form:
        CategoryFormState,
): string | null {
    if (!form.name.trim()) {
        return "El nombre de la categoría es obligatorio.";
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
