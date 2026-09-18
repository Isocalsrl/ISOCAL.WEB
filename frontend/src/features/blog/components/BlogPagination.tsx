export function BlogPagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
    if (totalPages < 2 && page <= 1) return null;
    return <nav className="blog-pagination" aria-label="Páginas del blog">
        <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)}>Anterior</button>
        <span aria-live="polite">Página {page} de {Math.max(1, totalPages)}</span>
        <button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Siguiente</button>
    </nav>;
}
