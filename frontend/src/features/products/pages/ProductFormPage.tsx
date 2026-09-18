import { ActionLink } from "../../../shared/components/ui/ActionLink";
import { SectionState } from "../../../shared/components/ui/SectionState";
import { ManagementHeader } from "../../admin/components/ManagementHeader";
import { ProductEditorForm } from "../components/admin/ProductEditorForm";
import { useProductForm } from "../hooks/useProductForm";

export function ProductFormPage() {
    const {
        form,
        categories,
        imageFile,
        existingImageUrl,
        isEditing,
        isLoading,
        isSubmitting,
        errorMessage,
        updateName,
        updateSlug,
        updateCategoryId,
        updateDescription,
        updateImage,
        submit,
        goBack,
    } = useProductForm();

    if (isLoading) {
        return (
            <SectionState
                title="Preparando formulario"
                description="Estamos cargando la información necesaria."
                isLoading
            />
        );
    }

    if (errorMessage && isEditing && form.name === "") {
        return (
            <SectionState
                title="No se pudo abrir el producto"
                description={errorMessage}
                actionLabel="Volver a productos"
                onAction={goBack}
            />
        );
    }

    return (
        <section className="management-page">
            <ManagementHeader
                eyebrow="Catálogo"
                title={isEditing ? "Editar producto" : "Nuevo producto"}
                description="Completa únicamente la información que se mostrará en el catálogo."
                actions={
                    <ActionLink to="/admin/products" variant="secondary">
                        Volver
                    </ActionLink>
                }
            />

            <ProductEditorForm
                form={form}
                categories={categories}
                imageFile={imageFile}
                existingImageUrl={existingImageUrl}
                isEditing={isEditing}
                isSubmitting={isSubmitting}
                errorMessage={errorMessage}
                onNameChange={updateName}
                onSlugChange={updateSlug}
                onCategoryChange={updateCategoryId}
                onDescriptionChange={updateDescription}
                onImageChange={updateImage}
                onSubmit={() => void submit()}
            />
        </section>
    );
}
