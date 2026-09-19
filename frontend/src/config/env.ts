const configuredApiUrl = import.meta.env.VITE_PUBLIC_API_URL?.trim();

export const env = {
    apiURL: (configuredApiUrl || (import.meta.env.DEV ? "http://localhost:3000" : "")).replace(/\/$/, ""),
};
