import {
    useNavigate,
} from "react-router-dom";

import {
    PageSeo,
} from "../../../shared/seo/PageSeo";

import {
    FavoritesHero,
} from "../components/FavoritesHero";

import {
    FavoritesProductsSection,
} from "../components/FavoritesProductsSection";

import {
    useFavoriteProducts,
} from "../hooks/useFavoriteProducts";

export function FavoritesPage() {
    const navigate = useNavigate();
    const favorites = useFavoriteProducts();

    return (
        <main className="public-main favorites-page">
            <PageSeo
                title="Favoritos | ISOCAL"
                description="Consulta los productos que guardaste como favoritos dentro del catálogo público de ISOCAL."
                canonicalPath="/favoritos"
            />

            <FavoritesHero />

            <FavoritesProductsSection
                favoriteCount={favorites.favoriteCount}
                products={favorites.favoriteProducts}
                categoryNamesById={favorites.categoryNamesById}
                isLoading={favorites.isLoading}
                errorMessage={favorites.errorMessage}
                onReload={favorites.reload}
                onOpenProduct={(productId) => {
                    navigate(`/productos/${productId}?origen=favoritos`);
                }}
            />
        </main>
    );
}
