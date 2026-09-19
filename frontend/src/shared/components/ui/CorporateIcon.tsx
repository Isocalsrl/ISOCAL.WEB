import type { SVGProps } from "react";

const paths = {
    arrow: "M4 12h16m-6-6 6 6-6 6",
    chevron: "m6 9 6 6 6-6",
    plus: "M12 5v14M5 12h14",
    close: "m6 6 12 12M6 18 18 6",
    menu: "M4 6h16M4 12h16M4 18h16",
    phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z",
    mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm-2 2 10 7L22 6",
    message: "M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a9 9 0 0 1-.9-4A8.5 8.5 0 0 1 12.5 3H13a8.5 8.5 0 0 1 8 8v.5Z",
    book: "M12 7v14m0-14C9 4 5 3 2 4v15c4-1 7 0 10 2m0-14c3-3 7-4 10-3v15c-4-1-7 0-10 2",
    clipboard: "M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3M9 2h6v4H9V2Zm-1 9h8m-8 5h8",
    check: "m5 12 4 4L19 6",
    up: "M12 20V4m-6 6 6-6 6 6",
    pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
    search: "m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
    linkedin: "M6 9v12M6 5.5v.01M11 21v-7a5 5 0 0 1 10 0v7M11 9v12",
    instagram: "M8 2h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8a6 6 0 0 1 6-6Zm8.5 4.5h.01M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
    facebook: "M14 8h3V4h-3a5 5 0 0 0-5 5v3H6v4h3v6h4v-6h3.2l.8-4H13V9a1 1 0 0 1 1-1Z",
    youtube: "M22 12s0-4-1-6c-.5-1-1.5-1.5-2.5-1.7C16.5 4 12 4 12 4s-4.5 0-6.5.3C4.5 4.5 3.5 5 3 6c-1 2-1 6-1 6s0 4 1 6c.5 1 1.5 1.5 2.5 1.7C7.5 20 12 20 12 20s4.5 0 6.5-.3c1-.2 2-.7 2.5-1.7 1-2 1-6 1-6ZM10 9l5 3-5 3V9Z",
    external: "M14 4h6v6M20 4 11 13M20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5",
    file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 0v6h6M8 13h8M8 17h6",
    lock: "M6 10V8a6 6 0 0 1 12 0v2M5 10h14v11H5z",
    info: "M12 8h.01M11 12h1v4h1M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-3-10 2 2 4-4",
    package: "m3 7 9-5 9 5-9 5-9-5Zm0 0v10l9 5 9-5V7M12 12v10",
    ruler: "M4 18 18 4l2 2L6 20 4 18Zm7-7 2 2m1-5 2 2m-8 4 2 2",
    clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-14v5l3 2",
    user: "M20 21a8 8 0 0 0-16 0m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
    layers: "m12 2 9 5-9 5-9-5 9-5Zm9 10-9 5-9-5m18 5-9 5-9-5",
} as const;

export function CorporateIcon({
    name,
    ...props
}: SVGProps<SVGSVGElement> & { name: keyof typeof paths }) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            {...props}
        >
            <path d={paths[name]} />
        </svg>
    );
}
