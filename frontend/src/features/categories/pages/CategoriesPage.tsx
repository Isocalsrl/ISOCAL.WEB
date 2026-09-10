import {
    useCallback,
    useEffect,
    useState,
    type FormEvent,
} from "react";

import {
    ApiError,
} from "../../../shared/api/httpClient";

import {
    InlineAlert,
} from "../../../shared/components/feedback/InlineAlert";

import {
    Button,
} from "../../../shared/components/ui/Button";

import {
    ConfirmDialog,
} from "../../../shared/components/ui/ConfirmDialog";

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
    from "../api/categories.api";

import type {
    Category,
} from "../types/category.types";

interface CategoryFormState {
    name: string;
    slug: string;
    description: string;
}

const EMPTY_FORM: CategoryFormState = {
    name: "",
    slug: "",
    description: "",
};

function sortCategories(
    categories: Category[],
): Category[] {
    return [...categories].sort(
        (firstCategory, secondCategory) =>
            firstCategory.name.localeCompare(
                secondCategory.name,
                "es",
            ),
    );
}

export function CategoriesPage() {
    const [
        categories,
        setCategories,
    ] = useState<Category[]>([]);

    const [
        form,
        setForm,
    ] = useState<CategoryFormState>(
        EMPTY_FORM,
    );

    const [
        categoryBeingEdited,
        setCategoryBeingEdited,
    ] = useState<Category | null>(null);

    const [
        categoryToDeactivate,
        setCategoryToDeactivate,
    ] = useState<Category | null>(null);

    const [
        slugWasEdited,
        setSlugWasEdited,
    ] = useState(false);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    const [
        isDeactivating,
        setIsDeactivating,
    ] = useState(false);

    const [
        errorMessage,
        setErrorMessage,
    ] = useState<string | null>(null);

    const [
        hasLoadError,
        setHasLoadError,
    ] = useState(false);

    const [
        successMessage,
        setSuccessMessage,
    ] = useState<string | null>(null);

    const loadCategories =
        useCallback(
            async (): Promise<void> => {
                setErrorMessage(null);
                setHasLoadError(false);
                setIsLoading(true);

                try {
                    setCategories(
                        await categoriesApi
                            .listCategories(),
                    );
                } catch (error) {
                    setHasLoadError(true);
                    setErrorMessage(
                        error instanceof ApiError
                            ? error.message
                            : "No se pudo cargar el listado de categorías.",
                    );
                } finally {
                    setIsLoading(false);
                }
            },
            [],
        );

    useEffect(() => {
        let isActive = true;

        void categoriesApi
            .listCategories()
            .then((nextCategories) => {
                if (isActive) {
                    setHasLoadError(false);
                    setCategories(
                        nextCategories,
                    );
                }
            })
            .catch((error: unknown) => {
                if (isActive) {
                    setHasLoadError(true);
                    setErrorMessage(
                        error instanceof ApiError
                            ? error.message
                            : "No se pudo cargar el listado de categorías.",
                    );
                }
            })
            .finally(() => {
                if (isActive) {
                    setIsLoading(false);
                }
            });

        return () => {
            isActive = false;
        };
    }, []);

    function resetForm(): void {
        setForm(EMPTY_FORM);
        setCategoryBeingEdited(null);
        setSlugWasEdited(false);
    }

    function editCategory(
        category: Category,
    ): void {
        setCategoryBeingEdited(category);
        setForm({
            name: category.name,
            slug: category.slug,
            description:
                category.description ?? "",
        });
        setSlugWasEdited(true);
        setErrorMessage(null);
        setSuccessMessage(null);
    }

    function validateForm():
        string | null {
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

    async function handleSubmit(
        event:
            FormEvent<HTMLFormElement>,
    ): Promise<void> {
        event.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        const validationMessage =
            validateForm();

        if (validationMessage) {
            setErrorMessage(validationMessage);
            return;
        }

        setIsSubmitting(true);

        const input = {
            name: form.name.trim(),
            slug: form.slug.trim(),
            description:
                form.description.trim() || null,
        };

        try {
            if (categoryBeingEdited) {
                const updatedCategory =
                    await categoriesApi
                        .updateCategory(
                            categoryBeingEdited.id,
                            input,
                        );

                setCategories(
                    (currentCategories) =>
                        sortCategories(
                            currentCategories.map(
                                (category) =>
                                    category.id ===
                                    updatedCategory.id
                                        ? updatedCategory
                                        : category,
                            ),
                        ),
                );

                setSuccessMessage(
                    "Categoría actualizada correctamente.",
                );
            } else {
                const createdCategory =
                    await categoriesApi
                        .createCategory(input);

                setCategories(
                    (currentCategories) =>
                        sortCategories([
                            ...currentCategories,
                            createdCategory,
                        ]),
                );

                setSuccessMessage(
                    "Categoría creada correctamente.",
                );
            }

            resetForm();
        } catch (error) {
            setErrorMessage(
                error instanceof ApiError
                    ? error.message
                    : "No se pudo guardar la categoría.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleDeactivate():
        Promise<void> {
        if (!categoryToDeactivate) {
            return;
        }

        setErrorMessage(null);
        setSuccessMessage(null);
        setIsDeactivating(true);

        try {
            await categoriesApi
                .deactivateCategory(
                    categoryToDeactivate.id,
                );

            setCategories(
                (currentCategories) =>
                    currentCategories.filter(
                        (category) =>
                            category.id !==
                            categoryToDeactivate.id,
                    ),
            );

            if (
                categoryBeingEdited?.id ===
                categoryToDeactivate.id
            ) {
                resetForm();
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
            setCategoryToDeactivate(null);
            setIsDeactivating(false);
        }
    }

    return (
        <section className="management-page">
            <ManagementHeader
                eyebrow="Clasificación"
                title="Categorías"
                description="Organiza los productos mediante categorías claras y consistentes."
                actions={
                    categoryBeingEdited ? (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={resetForm}
                        >
                            Nueva categoría
                        </Button>
                    ) : undefined
                }
            />

            {successMessage && (
                <InlineAlert variant="success">
                    {successMessage}
                </InlineAlert>
            )}

            {errorMessage &&
                !hasLoadError && (
                <InlineAlert>
                    {errorMessage}
                </InlineAlert>
                )}

            {isLoading ? (
                <SectionState
                    title="Cargando categorías"
                    description="Estamos consultando la clasificación del catálogo."
                    isLoading
                />
            ) : hasLoadError &&
              errorMessage ? (
                <SectionState
                    title="No se pudieron cargar las categorías"
                    description={errorMessage}
                    actionLabel="Reintentar"
                    onAction={() => {
                        void loadCategories();
                    }}
                />
            ) : (
                <div className="category-workspace">
                    <div className="data-panel">
                        <div className="category-list-heading">
                            <h2>Categorías activas</h2>
                            <span>{categories.length}</span>
                        </div>

                        {categories.length === 0 ? (
                            <div className="category-empty">
                                No hay categorías registradas.
                            </div>
                        ) : (
                            <div className="category-list">
                                {categories.map(
                                    (category) => (
                                        <article
                                            className="category-item"
                                            key={category.id}
                                        >
                                            <div>
                                                <strong>
                                                    {category.name}
                                                </strong>
                                                <span>
                                                    /{category.slug}
                                                </span>
                                                <p>
                                                    {category.description ??
                                                        "Sin descripción"}
                                                </p>
                                            </div>

                                            <div className="data-actions">
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    onClick={() => {
                                                        editCategory(category);
                                                    }}
                                                >
                                                    Editar
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="danger"
                                                    onClick={() => {
                                                        setCategoryToDeactivate(
                                                            category,
                                                        );
                                                    }}
                                                >
                                                    Desactivar
                                                </Button>
                                            </div>
                                        </article>
                                    ),
                                )}
                            </div>
                        )}
                    </div>

                    <div className="management-form-panel category-editor">
                        <p className="eyebrow">
                            {categoryBeingEdited
                                ? "Edición"
                                : "Registro"}
                        </p>
                        <h2>
                            {categoryBeingEdited
                                ? "Editar categoría"
                                : "Nueva categoría"}
                        </h2>
                        <p className="category-editor-intro">
                            Define un nombre claro y un identificador único.
                        </p>

                        <form
                            className="management-form"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            <FormField
                                label="Nombre"
                                htmlFor="category-name"
                                required
                            >
                                <input
                                    className="form-control"
                                    id="category-name"
                                    value={form.name}
                                    maxLength={100}
                                    disabled={isSubmitting}
                                    onChange={(event) => {
                                        const name =
                                            event.target.value;

                                        setForm(
                                            (currentForm) => ({
                                                ...currentForm,
                                                name,
                                                slug: slugWasEdited
                                                    ? currentForm.slug
                                                    : toSlug(name),
                                            }),
                                        );
                                    }}
                                    required
                                />
                            </FormField>

                            <FormField
                                label="Identificador URL"
                                htmlFor="category-slug"
                                hint="Ejemplo: metrologia"
                                required
                            >
                                <input
                                    className="form-control"
                                    id="category-slug"
                                    value={form.slug}
                                    maxLength={120}
                                    disabled={isSubmitting}
                                    onChange={(event) => {
                                        setSlugWasEdited(true);
                                        setForm(
                                            (currentForm) => ({
                                                ...currentForm,
                                                slug: toSlug(
                                                    event.target.value,
                                                ),
                                            }),
                                        );
                                    }}
                                    required
                                />
                            </FormField>

                            <FormField
                                label="Descripción"
                                htmlFor="category-description"
                            >
                                <textarea
                                    className="form-control"
                                    id="category-description"
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

                            <div className="form-actions">
                                {categoryBeingEdited && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={resetForm}
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </Button>
                                )}

                                <Button
                                    type="submit"
                                    isLoading={isSubmitting}
                                    loadingLabel="Guardando..."
                                >
                                    {categoryBeingEdited
                                        ? "Guardar cambios"
                                        : "Crear categoría"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={
                    categoryToDeactivate !== null
                }
                title="Desactivar categoría"
                description={`La categoría “${categoryToDeactivate?.name ?? ""}” dejará de estar disponible para nuevos productos.`}
                confirmLabel="Desactivar categoría"
                isConfirming={isDeactivating}
                onCancel={() => {
                    setCategoryToDeactivate(null);
                }}
                onConfirm={() => {
                    void handleDeactivate();
                }}
            />
        </section>
    );
}
