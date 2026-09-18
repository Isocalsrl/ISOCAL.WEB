export const env = {
    apiURL: (import.meta.env.VITE_PUBLIC_API_URL ?? "http://localhost:3000").replace(/\/$/, ""),
};
