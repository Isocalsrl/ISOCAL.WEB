import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../../../shared/api/httpClient";
import { removeBlogCover, saveBlogPost, uploadBlogContentImage, uploadBlogCover } from "../api/blog.api";
import { EMPTY_BLOG_INPUT, toBlogInput } from "../model/blogEditor";
import type { AdminBlogPost, BlogInput, BlogStatus } from "../model/blog.types";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_COVER_BYTES = 5 * 1024 * 1024;

export function useBlogEditor(initialPost: AdminBlogPost | null) {
    const navigate = useNavigate();
    const [post, setPost] = useState(initialPost);
    const [input, setInput] = useState<BlogInput>(() => initialPost ? toBlogInput(initialPost) : { ...EMPTY_BLOG_INPUT });
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [removeExistingCover, setRemoveExistingCover] = useState(false);
    const [busy, setBusy] = useState(false);
    const [uploadingContentImage, setUploadingContentImage] = useState(false);
    const [needsEditorUrl, setNeedsEditorUrl] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const contentDirty = JSON.stringify(input) !== JSON.stringify(post ? toBlogInput(post) : EMPTY_BLOG_INPUT);
    const dirty = contentDirty || coverFile !== null || removeExistingCover;

    const coverPreviewUrl = useMemo(() => {
        if (!coverFile) return null;
        return URL.createObjectURL(coverFile);
    }, [coverFile]);

    useEffect(() => {
        if (!coverPreviewUrl) return undefined;
        return () => URL.revokeObjectURL(coverPreviewUrl);
    }, [coverPreviewUrl]);

    useEffect(() => {
        if (!dirty) return;
        const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [dirty]);

    function accept(next: AdminBlogPost, message?: string) {
        setPost(next);
        setInput(toBlogInput(next));
        setCoverFile(null);
        setRemoveExistingCover(false);
        setNotice(message ?? (next.status === "published" ? "Artículo publicado." : "Cambios guardados."));
    }

    function selectCover(file: File | null) {
        setError("");
        setNotice("");
        if (!file) {
            setCoverFile(null);
            return;
        }
        if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
            setError("La portada debe ser JPG, PNG o WEBP.");
            return;
        }
        if (file.size > MAX_COVER_BYTES) {
            setError("La portada no puede superar los 5 MB.");
            return;
        }
        setCoverFile(file);
        setRemoveExistingCover(false);
        if (!input.coverAlt.trim()) {
            setInput((current) => ({ ...current, coverAlt: current.title.trim() || "Imagen de portada del artículo" }));
        }
    }

    function removeCover() {
        setCoverFile(null);
        setRemoveExistingCover(Boolean(post?.coverUrl));
        setNotice("");
    }

    async function uploadContentImage(file: File): Promise<string | null> {
        if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
            setError("La imagen debe ser JPG, PNG o WEBP.");
            return null;
        }
        if (file.size > MAX_COVER_BYTES) {
            setError("La imagen no puede superar los 5 MB.");
            return null;
        }
        if (!post && (!input.title.trim() || !input.slug.trim())) {
            setError("Escribe el título del artículo antes de insertar una imagen. La URL se completará automáticamente.");
            return null;
        }

        setUploadingContentImage(true);
        setError("");
        setNotice("");
        const wasNew = post === null;

        try {
            let targetPost = post;

            if (!targetPost) {
                targetPost = await saveBlogPost({ ...input, status: "draft" }, null);

                if (coverFile) {
                    targetPost = await uploadBlogCover(targetPost, coverFile, input.coverAlt.trim());
                    setCoverFile(null);
                }

                setPost(targetPost);
                setInput(toBlogInput(targetPost));
                setNeedsEditorUrl(true);
            }

            const result = await uploadBlogContentImage(targetPost.id, file);
            setNotice(wasNew
                ? "Borrador creado automáticamente e imagen cargada. Se insertó en el contenido; guarda para conservar el cambio."
                : "Imagen cargada. Se insertó en el contenido; guarda el artículo para conservar el cambio.");

            return result.url;
        } catch (cause) {
            setError(cause instanceof ApiError ? cause.message : "No se pudo subir la imagen del artículo.");
            return null;
        } finally {
            setUploadingContentImage(false);
        }
    }

    async function save(status: BlogStatus) {
        if (busy) return;
        if (coverFile && !input.coverAlt.trim()) {
            setError("Describe la imagen de portada antes de guardar.");
            return;
        }

        setBusy(true);
        setError("");
        setNotice("");
        const wasNew = post === null;
        let savedPost: AdminBlogPost | null = null;

        try {
            savedPost = await saveBlogPost({ ...input, status }, post);
            setPost(savedPost);

            if (coverFile) {
                savedPost = await uploadBlogCover(savedPost, coverFile, input.coverAlt.trim());
            } else if (removeExistingCover && savedPost.coverUrl) {
                savedPost = await removeBlogCover(savedPost);
            }

            accept(savedPost);
            if (wasNew || needsEditorUrl) {
                setNeedsEditorUrl(false);
                navigate(`/admin/blog/${savedPost.id}/edit`, { replace: true });
            }
        } catch (cause) {
            const message = cause instanceof ApiError
                ? cause.message
                : "No se pudieron guardar los cambios. Puedes reintentar.";

            if (savedPost) {
                setPost(savedPost);
                setInput(toBlogInput(savedPost));
                setError(`El artículo se guardó, pero faltó completar la imagen: ${message}`);
            } else {
                setError(message);
            }
        } finally {
            setBusy(false);
        }
    }

    return {
        post,
        input,
        busy,
        error,
        notice,
        dirty,
        coverFile,
        coverPreviewUrl,
        removeExistingCover,
        setInput,
        selectCover,
        removeCover,
        save,
        uploadContentImage,
        uploadingContentImage,
    };
}
