import { useTransientFeedback } from "../../../shared/hooks/useTransientFeedback";
import { useFavorites } from "../hooks/useFavorites";
import { FavoriteIcon } from "./FavoriteIcon";

interface FavoriteToggleButtonProps {
    productId: number;
    productName: string;
    className?: string;
    showText?: boolean;
}

export function FavoriteToggleButton({
    productId,
    productName,
    className = "",
    showText = false,
}: FavoriteToggleButtonProps) {
    const { isFavorite, toggleFavorite } = useFavorites();
    const { message, showFeedback } = useTransientFeedback();
    const favorite = isFavorite(productId);

    const actionLabel = favorite
        ? `Quitar ${productName} de favoritos`
        : `Agregar ${productName} a favoritos`;

    const visibleLabel = favorite ? "En favoritos" : "Guardar en favoritos";

    return (
        <button
            className={[
                "favorite-toggle",
                favorite ? "favorite-toggle-active" : "",
                showText ? "favorite-toggle-with-text" : "",
                message ? "selection-feedback-active" : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            type="button"
            aria-label={actionLabel}
            aria-pressed={favorite}
            title={actionLabel}
            onClick={() => {
                toggleFavorite(productId);
                showFeedback(favorite ? "Quitado de favoritos" : "Guardado en favoritos");
            }}
        >
            <FavoriteIcon isFilled={favorite} />

            <span className={showText ? "favorite-toggle-label" : "sr-only"}>
                {visibleLabel}
            </span>

            {message ? (
                <span className="selection-feedback-message" role="status" aria-live="polite">
                    {message}
                </span>
            ) : null}
        </button>
    );
}
