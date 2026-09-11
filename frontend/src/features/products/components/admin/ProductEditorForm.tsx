import { type FormEvent, useEffect, useMemo } from "react";
import { InlineAlert } from "../../../../shared/components/feedback/InlineAlert";
import { ActionLink } from "../../../../shared/components/ui/ActionLink";
import { Button } from "../../../../shared/components/ui/Button";
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

export function ProductEditorForm({ form, categories, imageFile, existingImageUrl, isEditing, isSubmitting, errorMessage, onNameChange, onSlugChange, onCategoryChange, onDescriptionChange, onImageChange, onSubmit }: Props) {
    const previewUrl = useMemo(() => imageFile ? URL.createObjectURL(imageFile) : existingImageUrl, [existingImageUrl, imageFile]);
    useEffect(() => imageFile && previewUrl ? () => URL.revokeObjectURL(previewUrl) : undefined, [imageFile, previewUrl]);

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        onSubmit();
    }

    return <div className="management-form-panel">
        <form className="management-form" onSubmit={handleSubmit} noValidate>
            {errorMessage && <InlineAlert>{errorMessage}</InlineAlert>}
            <div className="product-image-editor">
                <div className="product-image-preview">
                    {previewUrl ? <img src={previewUrl} alt="Vista previa del producto" /> : <div className="product-image-placeholder"><strong>ISOCAL</strong><span>Imagen principal pendiente</span></div>}
                </div>
                <FormField label="Imagen principal" htmlFor="product-image" hint={isEditing && existingImageUrl ? "Si no seleccionas otra imagen, se conservará la actual. JPG, PNG o WEBP; máximo 5 MB." : "Obligatoria. JPG, PNG o WEBP; máximo 5 MB."} required={!existingImageUrl}>
                    <input className="form-control product-image-input" id="product-image" type="file" accept="image/jpeg,image/png,image/webp" disabled={isSubmitting} required={!existingImageUrl} onChange={(event) => onImageChange(event.target.files?.[0] ?? null)} />
                </FormField>
            </div>
            <div className="form-grid">
                <FormField label="Nombre" htmlFor="product-name" required><input className="form-control" id="product-name" value={form.name} maxLength={150} disabled={isSubmitting} onChange={(event) => onNameChange(event.target.value)} required autoFocus /></FormField>
                <FormField label="Identificador URL" htmlFor="product-slug" hint="Ejemplo: calibracion-de-termometros" required><input className="form-control" id="product-slug" value={form.slug} maxLength={180} disabled={isSubmitting} onChange={(event) => onSlugChange(event.target.value)} required /></FormField>
                <FormField label="Categoría" htmlFor="product-category"><select className="form-control" id="product-category" value={form.categoryId} disabled={isSubmitting} onChange={(event) => onCategoryChange(event.target.value)}><option value="">Sin categoría</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></FormField>
                <div className="form-grid-full"><FormField label="Descripción" htmlFor="product-description" hint="Utiliza una descripción breve, técnica y verificable."><textarea className="form-control" id="product-description" value={form.description} disabled={isSubmitting} onChange={(event) => onDescriptionChange(event.target.value)} /></FormField></div>
            </div>
            <div className="form-actions"><ActionLink to="/admin/products" variant="secondary">Cancelar</ActionLink><Button type="submit" isLoading={isSubmitting} loadingLabel="Guardando...">{isEditing ? "Guardar cambios" : "Crear producto"}</Button></div>
        </form>
    </div>;
}
