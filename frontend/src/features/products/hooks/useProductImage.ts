import { useCallback, useState } from "react";
import { resolveApiUrl } from "../../../shared/api/apiUrl";

export function useProductImage() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string | null>(
        null,
    );

    const hydrateExistingImage = useCallback(
        (imageUrl: string | null): void => {
            setExistingImageUrl(resolveApiUrl(imageUrl));
            setImageFile(null);
        },
        [],
    );

    return {
        imageFile,
        existingImageUrl,
        updateImage: setImageFile,
        hydrateExistingImage,
    };
}
