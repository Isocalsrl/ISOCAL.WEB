import {
    Outlet,
} from "react-router-dom";

import {
    PublicFooter,
} from "./PublicFooter";

import {
    PublicHeader,
} from "./PublicHeader";

import "../styles/index.css";

export function PublicLayout() {
    return (
        <div className="public-site-shell">
            <PublicHeader />

            <Outlet />

            <PublicFooter />
        </div>
    );
}
