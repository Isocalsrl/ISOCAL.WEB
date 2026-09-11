import {
    useEffect,
} from "react";

interface PageSeoProps {
    title: string;
    description: string;
    canonicalPath: string;
    image?: string;
    structuredData?: Record<
        string,
        unknown
    >;
}

const SITE_URL =
    "https://www.isocal.pe";

function absoluteUrl(
    path: string,
): string {
    return new URL(
        path,
        SITE_URL,
    ).toString();
}

function setMetaTag(
    selector: string,
    attributes: Record<
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

export function PageSeo({
    title,
    description,
    canonicalPath,
    image =
        "/images/brand/isocal-social.png",
    structuredData,
}: PageSeoProps) {
    useEffect(() => {
        const previousTitle =
            document.title;

        document.title =
            title;

        const cleanups = [
            setMetaTag(
                'meta[name="description"]',
                {
                    name: "description",
                    content:
                        description,
                },
            ),

            setMetaTag(
                'meta[property="og:title"]',
                {
                    property:
                        "og:title",
                    content: title,
                },
            ),

            setMetaTag(
                'meta[property="og:description"]',
                {
                    property:
                        "og:description",
                    content:
                        description,
                },
            ),

            setMetaTag(
                'meta[property="og:type"]',
                {
                    property:
                        "og:type",
                    content:
                        "website",
                },
            ),

            setMetaTag(
                'meta[property="og:url"]',
                {
                    property:
                        "og:url",
                    content:
                        absoluteUrl(
                            canonicalPath,
                        ),
                },
            ),

            setMetaTag(
                'meta[property="og:image"]',
                {
                    property:
                        "og:image",
                    content:
                        absoluteUrl(
                            image,
                        ),
                },
            ),

            setMetaTag(
                'meta[name="twitter:card"]',
                {
                    name:
                        "twitter:card",
                    content:
                        "summary_large_image",
                },
            ),

            setMetaTag(
                'meta[name="twitter:title"]',
                {
                    name:
                        "twitter:title",
                    content: title,
                },
            ),

            setMetaTag(
                'meta[name="twitter:description"]',
                {
                    name:
                        "twitter:description",
                    content:
                        description,
                },
            ),

            setMetaTag(
                'meta[name="twitter:image"]',
                {
                    name:
                        "twitter:image",
                    content:
                        absoluteUrl(
                            image,
                        ),
                },
            ),
        ];

        let canonical =
            document.head.querySelector<HTMLLinkElement>(
                'link[rel="canonical"]',
            );

        const canonicalWasCreated =
            !canonical;

        const previousCanonicalHref =
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

        let structuredDataScript:
            HTMLScriptElement | null =
                null;

        if (structuredData) {
            structuredDataScript =
                document.createElement(
                    "script",
                );

            structuredDataScript.type =
                "application/ld+json";

            structuredDataScript.dataset.seo =
                "page-structured-data";

            structuredDataScript.text =
                JSON.stringify(
                    structuredData,
                );

            document.head.appendChild(
                structuredDataScript,
            );
        }

        return () => {
            document.title =
                previousTitle;

            cleanups.forEach(
                (cleanup) =>
                    cleanup(),
            );

            if (canonical) {
                if (
                    canonicalWasCreated
                ) {
                    canonical.remove();
                } else if (
                    previousCanonicalHref ===
                    null
                ) {
                    canonical.removeAttribute(
                        "href",
                    );
                } else {
                    canonical.setAttribute(
                        "href",
                        previousCanonicalHref,
                    );
                }
            }

            structuredDataScript?.remove();
        };
    }, [
        canonicalPath,
        description,
        image,
        structuredData,
        title,
    ]);

    return null;
}
