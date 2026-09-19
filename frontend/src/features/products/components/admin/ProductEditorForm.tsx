import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { InlineAlert } from "../../../../shared/components/feedback/InlineAlert";
import { ActionLink } from "../../../../shared/components/ui/ActionLink";
import { Button } from "../../../../shared/components/ui/Button";
import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";
import { FormField } from "../../../../shared/components/ui/FormField";
import type { Category } from "../../../categories/types/category.types";
import type { ProductFormState } from "../../model/productForm";

interface Props {
    form: ProductFormState;
    categories: readonly Category[];
    imageFile: File | null;
    existingImageUrl: string | null;
    isEditing: boolean;
    isSubmitting: boolean;
    errorMessage: string | null;
    onNameChange: (value: string) => void;
    onSlugChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onImageChange: (file: File | null) => void;
    onSubmit: () => void;
}

export function ProductEditorForm({
    form,
    categories,
    imageFile,
    existingImageUrl,
    isEditing,
    isSubmitting,
    errorMessage,
    onNameChange,
    onSlugChange,
    onCategoryChange,
    onDescriptionChange,
    onImageChange,
    onSubmit,
}: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const previewUrl = useMemo(
        () => (imageFile ? URL.createObjectURL(imageFile) : existingImageUrl),
        [existingImageUrl, imageFile],
    );

    useEffect(() => {
        if (!imageFile || !previewUrl) return undefined;
        return () => URL.revokeObjectURL(previewUrl);
    }, [imageFile, previewUrl]);

    function chooseImage(file: File | null): void {
        if (!file) return;
        onImageChange(file);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        onSubmit();
    }

    return (
        <form className="admin-editor-layout" onSubmit={handleSubmit} noValidate>
            <div className="admin-editor-main">
                {errorMessage && <InlineAlert>{errorMessage}</InlineAlert>}

                <section className="admin-form-section">
                    <div className="admin-form-section-heading">
                        <span className="admin-form-section-number">01</span>
                        <div>
                            <h2>Información del producto</h2>
                            <p>Estos datos aparecen en el catálogo público y deben ser claros para el cliente.</p>
                        </div>
                    </div>

                    <div className="form-grid">
                        <FormField label="Nombre" htmlFor="product-name" required>
                            <input
                                className="form-control"
                                id="product-name"
                                value={form.name}
                                maxLength={150}
                                disabled={isSubmitting}
                                onChange={(event) => onNameChange(event.target.value)}
                                required
                                autoFocus
                            />
                        </FormField>
                        <FormField
                            label="Identificador URL"
                            htmlFor="product-slug"
                            hint="Se usa en enlaces internos. Ejemplo: multimetro-digital-sonel"
                            required
                        >
                            <input
                                className="form-control"
                                id="product-slug"
                                value={form.slug}
                                maxLength={180}
                                disabled={isSubmitting}
                                onChange={(event) => onSlugChange(event.target.value)}
                                required
                            />
                        </FormField>
                        <FormField label="Categoría" htmlFor="product-category">
                            <select
                                className="form-control"
                                id="product-category"
                                value={form.categoryId}
                                disabled={isSubmitting}
                                onChange={(event) => onCategoryChange(event.target.value)}
                            >
                                <option value="">Sin categoría</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </FormField>
                        <div className="form-grid-full">
                            <FormField
                                label="Descripción"
                                htmlFor="product-description"
                                hint="Explica qué es el equipo y para qué tipo de trabajo se utiliza. Evita texto comercial genérico."
                            >
                                <textarea
                                    className="form-control admin-product-description"
                                    id="product-description"
                                    value={form.description}
                                    disabled={isSubmitting}
                                    onChange={(event) => onDescriptionChange(event.target.value)}
                                />
                            </FormField>
                        </div>
                    </div>
                </section>
            </div>

            <aside className="admin-editor-aside">
                <section className="admin-form-section admin-media-section">
                    <div className="admin-form-section-heading compact">
                        <span className="admin-form-section-number">02</span>
                        <div>
                            <h2>Imagen principal</h2>
                            <p>JPG, PNG o WEBP · máximo 5 MB.</p>
                        </div>
                    </div>

                    <button
                        className={`admin-image-dropzone ${isDragging ? "admin-image-dropzone-dragging" : ""}`}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => inputRef.current?.click()}
                        onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
                        onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(event) => {
                            event.preventDefault();
                            setIsDragging(false);
                            chooseImage(event.dataTransfer.files?.[0] ?? null);
                        }}
                    >
                        {previewUrl ? (
                            <img src={previewUrl} alt="Vista previa del producto" />
                        ) : (
                            <span className="admin-image-dropzone-empty">
                                <CorporateIcon name="package" />
                                <strong>Arrastra una imagen aquí</strong>
                                <small>o haz clic para seleccionar un archivo</small>
                            </span>
                        )}
                        {previewUrl && (
                            <span className="admin-image-dropzone-overlay">
                                <CorporateIcon name="plus" /> Cambiar imagen
                            </span>
                        )}
                    </button>

                    <input
                        ref={inputRef}
                        className="admin-file-input-hidden"
                        id="product-image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={isSubmitting}
                        required={!existingImageUrl}
                        onChange={(event) => chooseImage(event.target.files?.[0] ?? null)}
                    />
                    <p className="admin-media-hint">
                        {isEditing && existingImageUrl
                            ? "La imagen actual se conserva hasta que selecciones otra."
                            : "La imagen es obligatoria para publicar un producto nuevo."}
                    </p>
                </section>

                <section className="admin-editor-save-card">
                    <span className="admin-editor-save-label">Estado</span>
                    <strong>{isEditing ? "Editando producto" : "Producto nuevo"}</strong>
                    <p>Guarda cuando la información y la imagen estén listas.</p>
                    <div className="admin-editor-save-actions">
                        <Button type="submit" isLoading={isSubmitting} loadingLabel="Guardando...">
                            {isEditing ? "Guardar cambios" : "Crear producto"}
                        </Button>
                        <ActionLink to="/admin/products" variant="secondary">Cancelar</ActionLink>
                    </div>
                </section>
            </aside>
        </form>
    );
}
