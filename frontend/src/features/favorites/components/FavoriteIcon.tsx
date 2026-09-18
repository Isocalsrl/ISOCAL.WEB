interface FavoriteIconProps {
    isFilled?: boolean;
}

export function FavoriteIcon({
    isFilled = false,
}: FavoriteIconProps) {
    return (
        <svg
            className="favorite-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
        >
            <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                fill={
                    isFilled
                        ? "currentColor"
                        : "none"
                }
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
