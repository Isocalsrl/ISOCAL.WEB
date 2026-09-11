import {
    FavoriteIcon,
} from "./FavoriteIcon";

import {
    useFavorites,
} from "../hooks/useFavorites";

interface FavoriteToggleButtonProps {
    productId:
        number;

    productName:
        string;

    className?:
        string;

    showText?:
        boolean;
}

export function FavoriteToggleButton({
    productId,
    productName,
    className = "",
    showText = false,
}: FavoriteToggleButtonProps) {
    const {
        isFavorite,
        toggleFavorite,
    } = useFavorites();

    const favorite =
        isFavorite(productId);

    const actionLabel =
        favorite
            ? `Quitar ${productName} de favoritos`
            : `Agregar ${productName} a favoritos`;

    const visibleLabel =
        favorite
            ? "En favoritos"
            : "Guardar en favoritos";

    return (
        <button
            className={[
                "favorite-toggle",

                favorite
                    ? "favorite-toggle-active"
                    : "",

                showText
                    ? "favorite-toggle-with-text"
                    : "",

                className,
            ]
                .filter(Boolean)
                .join(" ")}
            type="button"
            aria-label={
                actionLabel
            }
            aria-pressed={
                favorite
            }
            title={
                actionLabel
            }
            onClick={() => {
                toggleFavorite(
                    productId,
                );
            }}
        >
            <FavoriteIcon
                isFilled={
                    favorite
                }
            />

            <span
                className={
                    showText
                        ? "favorite-toggle-label"
                        : "sr-only"
                }
            >
                {visibleLabel}
            </span>
        </button>
    );
}