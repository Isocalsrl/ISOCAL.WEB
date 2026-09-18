function SkeletonLine({ width = "100%" }: { width?: string }) {
    return <span className="ix-skeleton ix-skeleton-line" style={{width}} />;
}

export function ProductCardSkeleton() {
    return (
        <article className="ix-product-card-skeleton" aria-hidden="true">
            <div className="ix-skeleton ix-product-card-skeleton-media" />
            <div className="ix-product-card-skeleton-copy">
                <SkeletonLine width="34%" />
                <SkeletonLine width="78%" />
                <SkeletonLine width="94%" />
                <SkeletonLine width="66%" />
            </div>
            <div className="ix-skeleton ix-product-card-skeleton-action" />
        </article>
    );
}

export function CatalogSkeleton() {
    return (
        <div className="ix-loading-region" role="status" aria-live="polite" aria-busy="true">
            <span className="sr-only">Cargando catálogo de productos.</span>
            <div className="ix-catalog-skeleton" aria-hidden="true">
                <aside className="ix-catalog-skeleton-sidebar">
                    <SkeletonLine width="44%" />
                    {Array.from({ length: 6 }, (_, index) => (
                        <div className="ix-catalog-skeleton-filter" key={index}>
                            <SkeletonLine width={`${58 + (index % 3) * 12}%`} />
                            <span className="ix-skeleton ix-skeleton-chip" />
                        </div>
                    ))}
                </aside>

                <div className="ix-catalog-skeleton-main">
                    <div className="ix-catalog-skeleton-toolbar">
                        <div>
                            <SkeletonLine width="28%" />
                            <span className="ix-skeleton ix-skeleton-input" />
                        </div>
                        <SkeletonLine width="8rem" />
                    </div>

                    <div className="catalog-products-grid ix-skeleton-product-grid">
                        {Array.from({ length: 6 }, (_, index) => (
                            <ProductCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function FavoritesSkeleton() {
    return (
        <div className="ix-loading-region" role="status" aria-live="polite" aria-busy="true">
            <span className="sr-only">Cargando tus productos favoritos.</span>
            <div className="catalog-products-grid favorites-products-grid ix-skeleton-product-grid" aria-hidden="true">
                {Array.from({ length: 3 }, (_, index) => (
                    <ProductCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
}

export function ProductDetailSkeleton() {
    return (
        <div className="ix-loading-region" role="status" aria-live="polite" aria-busy="true">
            <span className="sr-only">Cargando información del producto.</span>
            <div className="ix-product-detail-skeleton" aria-hidden="true">
                <div className="ix-product-detail-skeleton-main">
                    <div className="ix-skeleton ix-product-detail-skeleton-media" />
                    <SkeletonLine width="18%" />
                    <SkeletonLine width="34%" />
                    <SkeletonLine width="68%" />
                    <SkeletonLine width="92%" />
                    <SkeletonLine width="76%" />
                </div>
                <aside className="ix-product-detail-skeleton-aside">
                    <SkeletonLine width="34%" />
                    <SkeletonLine width="86%" />
                    <SkeletonLine width="94%" />
                    <SkeletonLine width="70%" />
                    <span className="ix-skeleton ix-skeleton-button" />
                    <span className="ix-skeleton ix-skeleton-button" />
                    <span className="ix-skeleton ix-skeleton-button" />
                </aside>
            </div>
        </div>
    );
}

export function QuotationFormSkeleton() {
    return (
        <div className="ix-loading-region ix-quotation-form-skeleton" role="status" aria-live="polite" aria-busy="true">
            <span className="sr-only">Cargando tu selección para cotizar.</span>
            <div aria-hidden="true">
                <SkeletonLine width="45%" />
                <SkeletonLine width="72%" />
                <div className="ix-skeleton-form-grid">
                    <span className="ix-skeleton ix-skeleton-input" />
                    <span className="ix-skeleton ix-skeleton-input" />
                    <span className="ix-skeleton ix-skeleton-input" />
                    <span className="ix-skeleton ix-skeleton-input" />
                </div>
                <span className="ix-skeleton ix-skeleton-textarea" />
                <span className="ix-skeleton ix-skeleton-button" />
            </div>
        </div>
    );
}
