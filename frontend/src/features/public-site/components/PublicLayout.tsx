import {
    Outlet,
} from "react-router-dom";

import {
    FavoritesProvider,
} from "../../favorites/context/FavoritesProvider";

import {
    QuotationProvider,
} from "../../quotation/context/QuotationProvider";

import {
    PublicFooter,
} from "./PublicFooter";

import {
    PublicHeader,
} from "./PublicHeader";

import {
    ScrollToTop,
} from "./ScrollToTop";

import "../styles/index.css";
import "../../favorites/styles/index.css";
import "../../quotation/styles/index.css";
import "../../products/styles/public-actions.css";

export function PublicLayout() {
    return (
        <FavoritesProvider>
            <QuotationProvider>
                <div className="public-site-shell">
                    <ScrollToTop />

                    <PublicHeader />

                    <Outlet />

                    <PublicFooter />
                </div>
            </QuotationProvider>
        </FavoritesProvider>
    );
}
