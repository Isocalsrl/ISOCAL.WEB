import { useState, type ImgHTMLAttributes } from "react";

type ProgressiveImageProps = ImgHTMLAttributes<HTMLImageElement>;

export function ProgressiveImage({ className = "", onLoad, onError, ...props }: ProgressiveImageProps) {
    const [ready, setReady] = useState(false);

    return (
        <img
            {...props}
            className={["ix-progressive-image", ready ? "is-ready" : "", className].filter(Boolean).join(" ")}
            onLoad={(event) => {
                setReady(true);
                onLoad?.(event);
            }}
            onError={(event) => {
                setReady(true);
                onError?.(event);
            }}
        />
    );
}
