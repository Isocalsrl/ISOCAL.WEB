import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { resolveApiUrl } from "../../../shared/api/apiUrl";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";
import { getAdminBlogPost } from "../api/blog.api";
import { BlogContent } from "../components/BlogContent";
import { BlogCoverEditor } from "../components/BlogCoverEditor";
import { BlogEditorFields } from "../components/BlogEditorFields";
import { useBlogEditor } from "../hooks/useBlogEditor";
import { useBlogResource } from "../hooks/useBlogResource";
import { BLOG_STATUS_LABELS } from "../model/blogEditor";
import type { AdminBlogPost } from "../model/blog.types";

function EditorWorkspace({ initialPost }: { initialPost: AdminBlogPost | null }) {
    const editor = useBlogEditor(initialPost);
    const [preview, setPreview] = useState(false);
    const canPublish = Boolean(
        editor.input.title.trim() &&
        editor.input.slug.trim() &&
        editor.input.excerpt.trim() &&
        editor.input.content.trim(),
    );
    const status = editor.post?.status ?? "draft";
    const previewCover = editor.coverPreviewUrl
        ?? (!editor.removeExistingCover ? resolveApiUrl(editor.post?.coverUrl ?? null) : null);

    return (
        <section className="management-page blog-admin blog-editor-page">
            <header className="blog-editor-header">
                <div>
                    <Link className="blog-editor-back" to="/admin/blog"><CorporateIcon name="arrow" /> Volver al blog</Link>
                    <span className="blog-editor-kicker">{initialPost ? "Edición" : "Nuevo contenido"}</span>
                    <h1>{initialPost ? "Editar artículo" : "Nuevo artículo"}</h1>
                    <div className="blog-editor-state-line">
                        <span className={`blog-status blog-status-${status}`}>{BLOG_STATUS_LABELS[status]}</span>
                        <span className={editor.dirty ? "is-dirty" : ""}>{editor.dirty ? "Cambios sin guardar" : "Todo guardado"}</span>
                    </div>
                </div>
                <div className="blog-editor-header-actions">
                    {editor.post?.status === "published" && (
                        <Link className="blog-view-public" to={`/blog/${editor.post.slug}`} target="_blank">
                            Ver publicación <CorporateIcon name="external" />
                        </Link>
                    )}
                </div>
            </header>

            {editor.error && <div className="blog-editor-error" role="alert"><CorporateIcon name="info" /><span>{editor.error}</span></div>}
            {editor.notice && <div className="blog-editor-notice" role="status"><CorporateIcon name="check" /><span>{editor.notice}</span></div>}

            <div className="blog-editor-mode-tabs" role="tablist" aria-label="Modo del editor">
                <button type="button" aria-selected={!preview} onClick={() => setPreview(false)}><CorporateIcon name="file" /> Editar</button>
                <button type="button" aria-selected={preview} onClick={() => setPreview(true)}><CorporateIcon name="external" /> Vista previa</button>
            </div>

            {preview ? (
                <section className="blog-editor-preview" aria-label="Vista previa del artículo">
                    <div className="blog-preview-browser-bar">
                        <span /><span /><span />
                        <strong>Vista previa · /blog/{editor.input.slug || "url-del-articulo"}</strong>
                    </div>
                    <article className="blog-preview-article">
                        <span className="blog-topic">{editor.input.topic || "Tema"}</span>
                        <h1>{editor.input.title || "Título del artículo"}</h1>
                        <p className="blog-preview-excerpt">{editor.input.excerpt || "El resumen del artículo aparecerá aquí."}</p>
                        {previewCover ? <img className="blog-preview-cover" src={previewCover} alt={editor.input.coverAlt} /> : <div className="blog-preview-no-cover">Sin imagen de portada</div>}
                        <BlogContent content={editor.input.content || "Empieza a escribir para ver el contenido aquí."} />
                    </article>
                </section>
            ) : (
                <form
                    className="blog-editor-layout"
                    onSubmit={(event) => { event.preventDefault(); void editor.save(status); }}
                >
                    <fieldset className="blog-editor-main" disabled={editor.busy}>
                        <BlogEditorFields
                            input={editor.input}
                            onChange={editor.setInput}
                            isNew={!editor.post}
                            onUploadImage={editor.uploadContentImage}
                            imageUploadDisabled={!editor.post && (!editor.input.title.trim() || !editor.input.slug.trim())}
                            isUploadingImage={editor.uploadingContentImage}
                        />
                    </fieldset>

                    <aside className="blog-editor-sidebar">
                        <BlogCoverEditor
                            existingUrl={editor.post?.coverUrl ?? null}
                            existingAlt={editor.post?.coverAlt ?? ""}
                            previewUrl={editor.coverPreviewUrl}
                            selectedFile={editor.coverFile}
                            removed={editor.removeExistingCover}
                            disabled={editor.busy}
                            alt={editor.input.coverAlt}
                            onFileChange={editor.selectCover}
                            onAltChange={(value) => editor.setInput({ ...editor.input, coverAlt: value })}
                            onRemove={editor.removeCover}
                        />

                        <section className="blog-publish-panel">
                            <span className="blog-panel-kicker">Publicación</span>
                            <h2>Estado del artículo</h2>
                            <div className="blog-publish-current">
                                <span className={`blog-publish-dot blog-publish-dot-${status}`} />
                                <div><strong>{BLOG_STATUS_LABELS[status]}</strong><small>{editor.dirty ? "Hay cambios pendientes" : "Versión guardada"}</small></div>
                            </div>

                            <button className="blog-save-button" type="submit" disabled={editor.busy}>
                                {editor.busy ? "Guardando…" : editor.post ? "Guardar cambios" : "Guardar borrador"}
                            </button>

                            {status !== "published" ? (
                                <button
                                    className="blog-publish-button"
                                    type="button"
                                    disabled={editor.busy || !canPublish}
                                    onClick={() => void editor.save("published")}
                                >
                                    <CorporateIcon name="check" /> Publicar artículo
                                </button>
                            ) : (
                                <button className="blog-unpublish-button" type="button" disabled={editor.busy} onClick={() => void editor.save("draft")}>
                                    Retirar publicación
                                </button>
                            )}

                            {status === "archived" && (
                                <button className="blog-restore-button" type="button" disabled={editor.busy} onClick={() => void editor.save("draft")}>
                                    Restaurar como borrador
                                </button>
                            )}

                            {!canPublish && (
                                <p className="blog-publish-help">Para publicar completa título, URL, resumen y contenido.</p>
                            )}
                            {!editor.post && editor.coverFile && (
                                <p className="blog-publish-help is-positive">La portada se subirá automáticamente al guardar. No necesitas guardar primero.</p>
                            )}
                        </section>
                    </aside>
                </form>
            )}
        </section>
    );
}

function ExistingEditor({ id }: { id: number }) {
    const resource = useBlogResource(useCallback((signal: AbortSignal) => getAdminBlogPost(id, signal), [id]));
    if (resource.isLoading) return <div className="blog-admin blog-admin-empty" role="status">Cargando artículo…</div>;
    if (!resource.data) return (
        <div className="blog-admin blog-admin-empty" role="alert">
            <CorporateIcon name="info" />
            <strong>No se pudo abrir el artículo</strong>
            <p>{resource.error?.message}</p>
            <button type="button" onClick={resource.reload}>Reintentar</button>
            <Link to="/admin/blog">Volver al blog</Link>
        </div>
    );
    return <EditorWorkspace initialPost={resource.data} />;
}

export function BlogEditorPage() {
    const { postId } = useParams();
    return postId ? <ExistingEditor key={postId} id={Number(postId)} /> : <EditorWorkspace key="new" initialPost={null} />;
}
