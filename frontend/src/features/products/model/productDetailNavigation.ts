export interface ProductDetailReturnTarget {
    url: string;
    label: string;
}

export function parseProductId(
    value: string | undefined,
): number | null {
    if (!value) {
        return null;
    }

    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function getProductDetailReturnTarget(options: {
    categorySlug: string | null;
    origin: string | null;
}): ProductDetailReturnTarget {
    if (options.origin === "favoritos") {
        return {
            url: "/favoritos",
            label: "Volver a favoritos",
        };
    }

    if (options.origin === "cotizacion") {
        return {
            url: "/cotizacion",
            label: "Volver a cotización",
        };
    }

    return {
        url: options.categorySlug
            ? `/productos?categoria=${encodeURIComponent(
                  options.categorySlug,
              )}`
            : "/productos",
        label: "Volver al catálogo",
    };
}
