import { CorporateIcon } from "../../../shared/components/ui/CorporateIcon";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuotation } from "../../quotation/hooks/useQuotation";
import { VirtualAssistant } from "../../assistant/components/VirtualAssistant";
export function FloatingTools() {
    const {quotationCount} = useQuotation();
    const {pathname} = useLocation();
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const update = () => setScrolled(window.scrollY > 500);
        window.addEventListener("scroll", update, { passive: true });
        return () => window.removeEventListener("scroll", update);
    }, []);
    return (
        <div className="co-floating-tools">
            {quotationCount > 0 && pathname !== "/cotizacion" && (
                <Link
                    key={quotationCount}
                    className="co-floating-cart"
                    to="/cotizacion"
                    aria-label={`Ver lista de cotización, ${quotationCount} productos para cotizar`}
                >
                    <CorporateIcon name="clipboard" />
                    <span>Lista de cotización</span>
                    <b>{quotationCount}</b>
                </Link>
            )}
            {scrolled && (
                <button
                    type="button"
                    className="co-back-top"
                    aria-label="Volver arriba"
                    onClick={() =>
                        window.scrollTo({
                            top: 0,
                            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                                ? "instant"
                                : "smooth",
                        })
                    }
                >
                    <CorporateIcon name="up" />
                </button>
            )}
            <VirtualAssistant />
        </div>
    );
}
