import { FloatingTools } from "./FloatingTools";
import { Outlet } from "react-router-dom";
import { FavoritesProvider } from "../../favorites/context/FavoritesProvider";
import { QuotationProvider } from "../../quotation/context/QuotationProvider";
import { PublicFooter } from "./PublicFooter";
import { PublicHeader } from "./PublicHeader";
import { ScrollToTop } from "./ScrollToTop";
import { PublicMotionController } from "./PublicMotionController";
import "../styles/index.css";

export function PublicLayout() {
    return (
        <FavoritesProvider>
            <QuotationProvider>
                <div className="public-site-shell">
                    <ScrollToTop />
                    <PublicMotionController />

                    <PublicHeader />

                    <Outlet />

                    <PublicFooter />
                    <FloatingTools />
                </div>
            </QuotationProvider>
        </FavoritesProvider>
    );
}
