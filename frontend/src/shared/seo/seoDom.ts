const SITE_URL =
    "https://www.isocal.pe";

export function absoluteUrl(
    path:
        string,
): string {
    return new URL(
        path,
        SITE_URL,
    ).toString();
}

export function setMetaTag(
    selector:
        string,
    attributes:
        Record<
            string,
            string
        >,
): () => void {
    let element =
        document.head.querySelector<HTMLMetaElement>(
            selector,
        );

    const wasCreated =
        !element;

    const previousContent =
        element?.getAttribute(
            "content",
        ) ?? null;

    if (!element) {
        element =
            document.createElement(
                "meta",
            );

        document.head.appendChild(
            element,
        );
    }

    Object.entries(
        attributes,
    ).forEach(
        ([name, value]) => {
            element?.setAttribute(
                name,
                value,
            );
        },
    );

    return () => {
        if (!element) {
            return;
        }

        if (wasCreated) {
            element.remove();
            return;
        }

        if (
            previousContent ===
            null
        ) {
            element.removeAttribute(
                "content",
            );
        } else {
            element.setAttribute(
                "content",
                previousContent,
            );
        }
    };
}

export function setCanonicalLink(
    canonicalPath:
        string,
): () => void {
    let canonical =
        document.head.querySelector<HTMLLinkElement>(
            'link[rel="canonical"]',
        );

    const wasCreated =
        !canonical;

    const previousHref =
        canonical?.getAttribute(
            "href",
        ) ?? null;

    if (!canonical) {
        canonical =
            document.createElement(
                "link",
            );
        canonical.rel =
            "canonical";
        document.head.appendChild(
            canonical,
        );
    }

    canonical.href =
        absoluteUrl(
            canonicalPath,
        );

    return () => {
        if (!canonical) {
            return;
        }

        if (wasCreated) {
            canonical.remove();
            return;
        }

        if (
            previousHref ===
            null
        ) {
            canonical.removeAttribute(
                "href",
            );
        } else {
            canonical.setAttribute(
                "href",
                previousHref,
            );
        }
    };
}

export function appendStructuredData(
    structuredData:
        Record<
            string,
            unknown
        > | undefined,
): () => void {
    if (!structuredData) {
        return () => {};
    }

    const script =
        document.createElement(
            "script",
        );

    script.type =
        "application/ld+json";
    script.dataset.seo =
        "page-structured-data";
    script.text =
        JSON.stringify(
            structuredData,
        );

    document.head.appendChild(
        script,
    );

    return () => {
        script.remove();
    };
}
