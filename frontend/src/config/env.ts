export const env = {
    apiURL: (
        import.meta.env.VITE_API_URL ??
        "http://localhost:3000"
    ).replace(/\/$/, ""),
};