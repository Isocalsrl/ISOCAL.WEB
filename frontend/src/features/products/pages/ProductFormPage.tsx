import {
    useEffect,
    useState,
    type FormEvent,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ApiError,
} from "../../../shared/api/httpClient";

import {
    InlineAlert,
} from "../../../shared/components/feedback/InlineAlert";

import {
    ActionLink,
} from "../../../shared/components/ui/ActionLink";

import {
    Button,
} from "../../../shared/components/ui/Button";

import {
    FormField,
} from "../../../shared/components/ui/FormField";

import {
    SectionState,
} from "../../../shared/components/ui/SectionState";

import {
    toSlug,
} from "../../../shared/utils/toSlug";

import {
    ManagementHeader,
} from "../../admin/components/ManagementHeader";

import * as categoriesApi
    from "../../categories/api/categories.api";

import type {
    Category,
} from "../../categories/types/category.types";

import * as productsApi
    from "../api/products.api";

interface ProductFormState {
    name: string;
    slug: string;
    description: string;
    categoryId: string;
}

const EMPTY_FORM: ProductFormState = {
    name: "",
    slug: "",
    description: "",
    categoryId: "",
};

export function ProductFormPage() {
    const {
        productId,
    } = useParams();

    const navigate =
        useNavigate();

    const isEditing =
        productId !== undefined;

    const numericProductId =
        Number(productId);

    const [
        form,
        setForm,
    ] = useState<ProductFormState>(
        EMPTY_FORM,
    );

    const [
        categories,
        setCategories,
    ] = useState<Category[]>([]);

    const [
        slugWasEdited,
        setSlugWasEdited,
    ] = useState(isEditing);

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
            setErrorMessage(null);
            setIsLoading(true);

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
                        : Promise.resolve(null),
                ]);

                if (!isActive) {
                    return;
                }

                setCategories(nextCategories);

                if (product) {
                    setForm({
                        name: product.name,
                        slug: product.slug,
                        description:
                            product.description ??
                            "",
                        categoryId:
                            product.categoryId
                                ?.toString() ??
                            "",
                    });
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
                    setIsLoading(false);
                }
            }
        }

        void loadForm();

        return () => {
            isActive = false;
        };
    }, [
        isEditing,
        numericProductId,
    ]);

    function validateForm():
        string | null {
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

    async function handleSubmit(
        event:
            FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();

        setErrorMessage(null);

        const validationMessage =
            validateForm();

        if (validationMessage) {
            setErrorMessage(
                validationMessage,
            );
            return;
        }

        setIsSubmitting(true);

        const input = {
            name: form.name.trim(),
            slug: form.slug.trim(),
            description:
                form.description.trim() ||
                null,
            categoryId:
                form.categoryId
                    ? Number(form.categoryId)
                    : null,
        };

        try {
            if (isEditing) {
                await productsApi
                    .updateProduct(
                        numericProductId,
                        input,
                    );
            } else {
                await productsApi
                    .createProduct(input);
            }

            navigate(
                "/admin/products",
                {
                    replace: true,
                    state: {
                        message: isEditing
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
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <SectionState
                title="Preparando formulario"
                description="Estamos cargando la información necesaria."
                isLoading
            />
        );
    }

    if (errorMessage && isEditing &&
        form.name === "") {
        return (
            <SectionState
                title="No se pudo abrir el producto"
                description={errorMessage}
                actionLabel="Volver a productos"
                onAction={() => {
                    navigate(
                        "/admin/products",
                    );
                }}
            />
        );
    }

    return (
        <section className="management-page">
            <ManagementHeader
                eyebrow="Catálogo"
                title={
                    isEditing
                        ? "Editar producto"
                        : "Nuevo producto"
                }
                description="Completa únicamente la información que se mostrará en el catálogo."
                actions={
                    <ActionLink
                        to="/admin/products"
                        variant="secondary"
                    >
                        Volver
                    </ActionLink>
                }
            />

            <div className="management-form-panel">
                <form
                    className="management-form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    {errorMessage && (
                        <InlineAlert>
                            {errorMessage}
                        </InlineAlert>
                    )}

                    <div className="form-grid">
                        <FormField
                            label="Nombre"
                            htmlFor="product-name"
                            required
                        >
                            <input
                                className="form-control"
                                id="product-name"
                                value={form.name}
                                maxLength={150}
                                disabled={isSubmitting}
                                onChange={(event) => {
                                    const name =
                                        event.target.value;

                                    setForm(
                                        (currentForm) => ({
                                            ...currentForm,
                                            name,
                                            slug:
                                                slugWasEdited
                                                    ? currentForm.slug
                                                    : toSlug(name),
                                        }),
                                    );
                                }}
                                required
                                autoFocus
                            />
                        </FormField>

                        <FormField
                            label="Identificador URL"
                            htmlFor="product-slug"
                            hint="Ejemplo: calibracion-de-termometros"
                            required
                        >
                            <input
                                className="form-control"
                                id="product-slug"
                                value={form.slug}
                                maxLength={180}
                                disabled={isSubmitting}
                                onChange={(event) => {
                                    setSlugWasEdited(true);
                                    setForm(
                                        (currentForm) => ({
                                            ...currentForm,
                                            slug:
                                                toSlug(
                                                    event.target.value,
                                                ),
                                        }),
                                    );
                                }}
                                required
                            />
                        </FormField>

                        <FormField
                            label="Categoría"
                            htmlFor="product-category"
                        >
                            <select
                                className="form-control"
                                id="product-category"
                                value={form.categoryId}
                                disabled={isSubmitting}
                                onChange={(event) => {
                                    setForm(
                                        (currentForm) => ({
                                            ...currentForm,
                                            categoryId:
                                                event.target.value,
                                        }),
                                    );
                                }}
                            >
                                <option value="">
                                    Sin categoría
                                </option>

                                {categories.map(
                                    (category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ),
                                )}
                            </select>
                        </FormField>

                        <div className="form-grid-full">
                            <FormField
                                label="Descripción"
                                htmlFor="product-description"
                                hint="Utiliza una descripción breve, técnica y verificable."
                            >
                                <textarea
                                    className="form-control"
                                    id="product-description"
                                    value={form.description}
                                    disabled={isSubmitting}
                                    onChange={(event) => {
                                        setForm(
                                            (currentForm) => ({
                                                ...currentForm,
                                                description:
                                                    event.target.value,
                                            }),
                                        );
                                    }}
                                />
                            </FormField>
                        </div>
                    </div>

                    <div className="form-actions">
                        <ActionLink
                            to="/admin/products"
                            variant="secondary"
                        >
                            Cancelar
                        </ActionLink>

                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            loadingLabel="Guardando..."
                        >
                            {isEditing
                                ? "Guardar cambios"
                                : "Crear producto"}
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
}
