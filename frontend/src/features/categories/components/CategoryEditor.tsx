import {
    type FormEvent,
} from "react";

import {
    Button,
} from "../../../shared/components/ui/Button";

import {
    FormField,
} from "../../../shared/components/ui/FormField";

import type {
    CategoryFormState,
} from "../model/categoryForm";

import type {
    Category,
} from "../types/category.types";

interface CategoryEditorProps {
    form:
        CategoryFormState;

    categoryBeingEdited:
        Category | null;

    isSubmitting:
        boolean;

    onNameChange:
        (
            value:
                string,
        ) => void;

    onSlugChange:
        (
            value:
                string,
        ) => void;

    onDescriptionChange:
        (
            value:
                string,
        ) => void;

    onCancel:
        () => void;

    onSubmit:
        () => void;
}

export function CategoryEditor({
    form,
    categoryBeingEdited,
    isSubmitting,
    onNameChange,
    onSlugChange,
    onDescriptionChange,
    onCancel,
    onSubmit,
}: CategoryEditorProps) {
    function handleSubmit(
        event:
            FormEvent<HTMLFormElement>,
    ): void {
        event.preventDefault();
        onSubmit();
    }

    return (
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
                onSubmit={
                    handleSubmit
                }
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
                        value={
                            form.name
                        }
                        maxLength={100}
                        disabled={
                            isSubmitting
                        }
                        onChange={(
                            event,
                        ) => {
                            onNameChange(
                                event.target.value,
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
                        value={
                            form.slug
                        }
                        maxLength={120}
                        disabled={
                            isSubmitting
                        }
                        onChange={(
                            event,
                        ) => {
                            onSlugChange(
                                event.target.value,
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
                        value={
                            form.description
                        }
                        disabled={
                            isSubmitting
                        }
                        onChange={(
                            event,
                        ) => {
                            onDescriptionChange(
                                event.target.value,
                            );
                        }}
                    />
                </FormField>

                <div className="form-actions">
                    {categoryBeingEdited && (
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={
                                onCancel
                            }
                            disabled={
                                isSubmitting
                            }
                        >
                            Cancelar
                        </Button>
                    )}

                    <Button
                        type="submit"
                        isLoading={
                            isSubmitting
                        }
                        loadingLabel="Guardando..."
                    >
                        {categoryBeingEdited
                            ? "Guardar cambios"
                            : "Crear categoría"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
