import { env } from "../../config/env";

export function resolveApiUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    return `${env.apiURL}${path.startsWith("/") ? path : `/${path}`}`;
}
