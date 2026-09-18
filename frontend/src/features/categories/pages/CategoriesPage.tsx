import { InlineAlert } from "../../../shared/components/feedback/InlineAlert";
import { Button } from "../../../shared/components/ui/Button";
import { ConfirmDialog } from "../../../shared/components/ui/ConfirmDialog";
import { SectionState } from "../../../shared/components/ui/SectionState";
import { ManagementHeader } from "../../admin/components/ManagementHeader";
import { useAuth } from "../../auth/hooks/useAuth";
import { CategoriesList } from "../components/CategoriesList";
import { CategoryEditor } from "../components/CategoryEditor";
import { useCategoriesManagement } from "../hooks/useCategoriesManagement";

export function CategoriesPage() {
    const { admin } = useAuth();
    const isSuperAdmin = admin?.role === "super_admin";

    const {
        categories,
        form,
        categoryBeingEdited,
        categoryToDeactivate,
        isLoading,
        isSubmitting,
        isDeactivating,
        reactivatingCategoryId,
        errorMessage,
        hasLoadError,
        successMessage,
        loadCategories,
        resetForm,
        editCategory,
        updateName,
        updateSlug,
        updateDescription,
        saveCategory,
        requestDeactivate,
        cancelDeactivate,
        deactivateCategory,
        reactivateCategory,
    } = useCategoriesManagement(isSuperAdmin);

    return (
        <section className="management-page">
            <ManagementHeader
                eyebrow="Clasificación"
                title="Categorías"
                description={
                    isSuperAdmin
                        ? "Supervisa la clasificación completa y recupera registros desactivados."
                        : "Organiza los productos mediante categorías claras y consistentes."
                }
                actions={
                    categoryBeingEdited ? (
                        <Button type="button" variant="secondary" onClick={resetForm}>
                            Nueva categoría
                        </Button>
                    ) : undefined
                }
            />

            {successMessage && (
                <InlineAlert variant="success">{successMessage}</InlineAlert>
            )}

            {errorMessage && !hasLoadError && <InlineAlert>{errorMessage}</InlineAlert>}

            {isLoading ? (
                <SectionState
                    title="Cargando categorías"
                    description="Estamos consultando la clasificación del catálogo."
                    isLoading
                />
            ) : hasLoadError && errorMessage ? (
                <SectionState
                    title="No se pudieron cargar las categorías"
                    description={errorMessage}
                    actionLabel="Reintentar"
                    onAction={() => void loadCategories()}
                />
            ) : (
                <div className="category-workspace">
                    <CategoriesList
                        categories={categories}
                        isSuperAdmin={isSuperAdmin}
                        reactivatingCategoryId={reactivatingCategoryId}
                        onEdit={editCategory}
                        onDeactivate={requestDeactivate}
                        onReactivate={(category) => void reactivateCategory(category)}
                    />

                    <CategoryEditor
                        form={form}
                        categoryBeingEdited={categoryBeingEdited}
                        isSubmitting={isSubmitting}
                        onNameChange={updateName}
                        onSlugChange={updateSlug}
                        onDescriptionChange={updateDescription}
                        onCancel={resetForm}
                        onSubmit={() => void saveCategory()}
                    />
                </div>
            )}

            <ConfirmDialog
                isOpen={categoryToDeactivate !== null}
                title="Desactivar categoría"
                description={`La categoría “${categoryToDeactivate?.name ?? ""}” dejará de estar disponible para nuevos productos.`}
                confirmLabel="Desactivar categoría"
                isConfirming={isDeactivating}
                onCancel={cancelDeactivate}
                onConfirm={() => void deactivateCategory()}
            />
        </section>
    );
}
