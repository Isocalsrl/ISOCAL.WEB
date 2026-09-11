import {
    useEffect,
} from "react";

import {
    absoluteUrl,
    appendStructuredData,
    setCanonicalLink,
    setMetaTag,
} from "./seoDom";

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

        const imageUrl =
            absoluteUrl(
                image,
            );

        const canonicalUrl =
            absoluteUrl(
                canonicalPath,
            );

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
                    content:
                        title,
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
                        canonicalUrl,
                },
            ),
            setMetaTag(
                'meta[property="og:image"]',
                {
                    property:
                        "og:image",
                    content:
                        imageUrl,
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
                    content:
                        title,
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
                        imageUrl,
                },
            ),
            setCanonicalLink(
                canonicalPath,
            ),
            appendStructuredData(
                structuredData,
            ),
        ];

        return () => {
            document.title =
                previousTitle;

            cleanups.forEach(
                (
                    cleanup,
                ) =>
                    cleanup(),
            );
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
