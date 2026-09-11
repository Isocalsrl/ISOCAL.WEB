import {
    Outlet,
} from "react-router-dom";

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

export function PublicLayout() {
    return (
        <div className="public-site-shell">
            <ScrollToTop />

            <PublicHeader />

            <Outlet />

            <PublicFooter />
        </div>
    );
}