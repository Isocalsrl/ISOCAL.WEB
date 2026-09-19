import { useMemo, useRef } from "react";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";
import { toSlug } from "../../../shared/utils/toSlug";
import type { BlogInput } from "../model/blog.types";

export function BlogEditorFields({ input, onChange, isNew, onUploadImage, imageUploadDisabled, isUploadingImage }: { input: BlogInput; onChange: (input: BlogInput) => void; isNew: boolean; onUploadImage: (file: File) => Promise<string | null>; imageUploadDisabled: boolean; isUploadingImage: boolean }) {
    const contentRef = useRef<HTMLTextAreaElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const wordCount = useMemo(() => input.content.trim() ? input.content.trim().split(/\s+/).length : 0, [input.content]);
    const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const change = (key: keyof BlogInput, value: string) => onChange({ ...input, [key]: value });

    function insert(before: string, after = "", placeholder = "Texto") {
        const textarea = contentRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selected = input.content.slice(start, end) || placeholder;
        change("content", input.content.slice(0, start) + before + selected + after + input.content.slice(end));
        requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
        });
    }

    async function insertImage(file: File | null) {
        if (!file) return;
        const textarea = contentRef.current;
        const position = textarea?.selectionStart ?? input.content.length;
        const url = await onUploadImage(file);
        if (!url) return;
        const prefix = position > 0 && !input.content.slice(0, position).endsWith("\n") ? "\n\n" : "";
        const markdown = `${prefix}![Describe esta imagen](${url})\n\n`;
        const next = input.content.slice(0, position) + markdown + input.content.slice(position);
        change("content", next);
        requestAnimationFrame(() => {
            const nextPosition = position + markdown.length;
            textarea?.focus();
            textarea?.setSelectionRange(nextPosition, nextPosition);
        });
        if (imageInputRef.current) imageInputRef.current.value = "";
    }

    return (
        <>
            <section className="blog-editor-section">
                <div className="blog-editor-section-heading">
                    <span>01</span>
                    <div>
                        <h2>Información del artículo</h2>
                        <p>Define un título claro, el tema y el resumen que verá el visitante antes de abrirlo.</p>
                    </div>
                </div>

                <div className="blog-editor-fields">
                    <label className="blog-admin-field blog-field-title">
                        <span>Título *</span>
                        <input
                            name="title"
                            value={input.title}
                            required
                            maxLength={180}
                            placeholder="Ej.: ¿Cada cuánto debo calibrar un instrumento?"
                            onChange={(event) => {
                                const title = event.target.value;
                                onChange({
                                    ...input,
                                    title,
                                    ...(isNew && (!input.slug || input.slug === toSlug(input.title)) ? { slug: toSlug(title) } : {}),
                                });
                            }}
                        />
                    </label>

                    <div className="blog-editor-grid">
                        <label className="blog-admin-field">
                            <span>URL del artículo *</span>
                            <div className="blog-slug-control"><span>/blog/</span><input name="slug" value={input.slug} required maxLength={160} pattern="[a-z0-9]+(-[a-z0-9]+)*" onChange={(event) => change("slug", event.target.value)} /></div>
                            <small>Se genera automáticamente a partir del título y puedes ajustarla.</small>
                        </label>
                        <label className="blog-admin-field">
                            <span>Tema *</span>
                            <input name="topic" value={input.topic} required maxLength={80} placeholder="Metrología" onChange={(event) => change("topic", event.target.value)} />
                        </label>
                    </div>

                    <label className="blog-admin-field">
                        <span>Autor o equipo *</span>
                        <input name="authorName" value={input.authorName} required maxLength={120} onChange={(event) => change("authorName", event.target.value)} />
                    </label>

                    <label className="blog-admin-field">
                        <span>Resumen *</span>
                        <textarea name="excerpt" value={input.excerpt} maxLength={400} rows={4} placeholder="Explica en 2 o 3 líneas qué aprenderá el lector." onChange={(event) => change("excerpt", event.target.value)} />
                        <small>{input.excerpt.length}/400 · Aparece en el listado del blog y en la cabecera del artículo.</small>
                    </label>
                </div>
            </section>

            <section className="blog-editor-section">
                <div className="blog-editor-section-heading">
                    <span>02</span>
                    <div>
                        <h2>Contenido</h2>
                        <p>Escribe con Markdown. Los botones aplican formato sobre el texto seleccionado.</p>
                    </div>
                </div>

                <div className="blog-editor-toolbar" role="toolbar" aria-label="Formato del artículo">
                    <button type="button" title="Agregar subtítulo" onClick={() => insert("\n## ", "\n", "Subtítulo")}><strong>H2</strong> Subtítulo</button>
                    <button type="button" title="Negrita" onClick={() => insert("**", "**")}><strong>B</strong> Negrita</button>
                    <button type="button" title="Lista" onClick={() => insert("\n- ", "\n", "Elemento")}><CorporateIcon name="layers" /> Lista</button>
                    <button type="button" title="Enlace" onClick={() => insert("[", "](https://)", "Texto del enlace")}><CorporateIcon name="external" /> Enlace</button>
                    <button
                        type="button"
                        title={imageUploadDisabled
                            ? "Escribe un título para habilitar la carga de imágenes"
                            : isNew
                                ? "Subir imagen; el borrador se creará automáticamente"
                                : "Subir e insertar imagen"}
                        disabled={imageUploadDisabled || isUploadingImage}
                        onClick={() => imageInputRef.current?.click()}
                    >
                        <CorporateIcon name="plus" /> {isUploadingImage ? "Subiendo…" : "Imagen"}
                    </button>
                    <input ref={imageInputRef} className="admin-file-input-hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void insertImage(event.target.files?.[0] ?? null)} />
                </div>

                <label className="blog-admin-field blog-content-field">
                    <span className="sr-only">Contenido del artículo</span>
                    <textarea
                        ref={contentRef}
                        name="content"
                        className="blog-markdown-input"
                        value={input.content}
                        maxLength={100000}
                        rows={24}
                        placeholder={"## Introducción\n\nExplica aquí el tema con lenguaje claro y técnico.\n\n## Recomendaciones\n\n- Primer punto\n- Segundo punto"}
                        onChange={(event) => change("content", event.target.value)}
                    />
                </label>
                <div className="blog-editor-content-meta">
                    <span>{wordCount.toLocaleString("es-PE")} palabras</span>
                    <span>~{readingMinutes} min de lectura</span>
                    <span>Markdown habilitado</span>
                    <span>{imageUploadDisabled ? "Escribe un título para insertar imágenes" : isNew ? "Las imágenes crean el borrador automáticamente" : "Puedes insertar imágenes"}</span>
                </div>
            </section>

            <details className="blog-seo-fields">
                <summary>
                    <span><CorporateIcon name="search" /> Presentación en buscadores</span>
                    <small>Opcional · si lo dejas vacío se usan el título y resumen.</small>
                </summary>
                <div className="blog-seo-fields-body">
                    <label className="blog-admin-field">
                        <span>Título SEO</span>
                        <input name="seoTitle" value={input.seoTitle} maxLength={180} onChange={(event) => change("seoTitle", event.target.value)} placeholder="Se usará el título del artículo" />
                    </label>
                    <label className="blog-admin-field">
                        <span>Descripción SEO</span>
                        <textarea name="seoDescription" value={input.seoDescription} maxLength={300} rows={3} onChange={(event) => change("seoDescription", event.target.value)} placeholder="Se usará el resumen del artículo" />
                    </label>
                </div>
            </details>
        </>
    );
}
