import { useRef, useState } from "react";
import { resolveApiUrl } from "../../../shared/api/apiUrl";
import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";

interface BlogCoverEditorProps {
    existingUrl: string | null;
    existingAlt: string;
    previewUrl: string | null;
    selectedFile: File | null;
    removed: boolean;
    disabled: boolean;
    alt: string;
    onFileChange: (file: File | null) => void;
    onAltChange: (value: string) => void;
    onRemove: () => void;
}

export function BlogCoverEditor({
    existingUrl,
    existingAlt,
    previewUrl,
    selectedFile,
    removed,
    disabled,
    alt,
    onFileChange,
    onAltChange,
    onRemove,
}: BlogCoverEditorProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const currentUrl = previewUrl ?? (!removed ? resolveApiUrl(existingUrl) : null);
    const hasImage = Boolean(currentUrl);

    return (
        <section className="blog-cover-panel">
            <div className="blog-cover-heading">
                <div>
                    <span className="blog-panel-kicker">Imagen principal</span>
                    <h2>Portada</h2>
                </div>
                {hasImage && (
                    <button className="blog-cover-remove" type="button" disabled={disabled} onClick={onRemove}>
                        Quitar
                    </button>
                )}
            </div>

            <button
                className={`blog-cover-dropzone ${isDragging ? "is-dragging" : ""} ${hasImage ? "has-image" : ""}`}
                type="button"
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
                onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
                onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                    onFileChange(event.dataTransfer.files?.[0] ?? null);
                }}
            >
                {currentUrl ? (
                    <img src={currentUrl} alt={selectedFile ? alt : existingAlt} />
                ) : (
                    <span className="blog-cover-empty">
                        <span className="blog-cover-empty-icon"><CorporateIcon name="plus" /></span>
                        <strong>Subir imagen</strong>
                        <small>Arrastra una foto o haz clic aquí</small>
                    </span>
                )}
                {currentUrl && (
                    <span className="blog-cover-change"><CorporateIcon name="plus" /> Cambiar portada</span>
                )}
            </button>

            <input
                ref={inputRef}
                className="admin-file-input-hidden"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={disabled}
                onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
            />

            <label className="blog-admin-field">
                <span>Descripción de la imagen</span>
                <input
                    value={alt}
                    maxLength={250}
                    disabled={disabled || (!hasImage && !selectedFile)}
                    placeholder="Ej.: Técnico realizando una calibración"
                    onChange={(event) => onAltChange(event.target.value)}
                />
                <small>Se usa para accesibilidad y cuando la imagen no puede mostrarse.</small>
            </label>

            <p className="blog-cover-help">JPG, PNG o WEBP · máximo 5 MB · recomendado 1600 × 900 px.</p>
        </section>
    );
}
