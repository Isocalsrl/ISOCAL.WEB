import {
    Outlet,
} from "react-router-dom";

import {
    FavoritesProvider,
} from "../../favorites/context/FavoritesProvider";

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

export function PublicLayout() {
    return (
        <FavoritesProvider>
            <div className="public-site-shell">
                <ScrollToTop />

                <PublicHeader />

                <Outlet />

                <PublicFooter />
            </div>
        </FavoritesProvider>
    );
}