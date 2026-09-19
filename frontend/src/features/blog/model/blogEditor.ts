import type { BlogInput, BlogPost } from './blog.types';

export const BLOG_STATUS_LABELS = { draft: 'Borrador', published: 'Publicado', archived: 'Archivado' } as const;
export const EMPTY_BLOG_INPUT: BlogInput = {
    title: '', slug: '', excerpt: '', content: '', topic: 'Metrología', authorName: 'Equipo ISOCAL',
    status: 'draft', seoTitle: '', seoDescription: '', coverAlt: '',
};
export function toBlogInput(post: BlogInput | (BlogPost & { status: BlogInput['status'] })): BlogInput {
    return Object.fromEntries(Object.keys(EMPTY_BLOG_INPUT).map(key => [key, post[key as keyof BlogInput]])) as unknown as BlogInput;
}
export function blogDate(date: string | null) {
    return date ? new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Lima' }).format(new Date(date)) : 'Sin publicar';
}
