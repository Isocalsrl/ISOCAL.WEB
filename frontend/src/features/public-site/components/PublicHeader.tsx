import { Link, useLocation } from "react-router-dom";
import { usePublicHeaderState } from "../hooks/usePublicHeaderState";
import { HeaderActions } from "./header/HeaderActions";
import { HeaderPrimaryNavigation } from "./header/HeaderPrimaryNavigation";
import { HeaderSearchPanel } from "./header/HeaderSearchPanel";
import { HeaderTopbar } from "./header/HeaderTopbar";

export function PublicHeader() {
    const location = useLocation();
    return <HeaderContent key={`${location.pathname}${location.search}${location.hash}`} />;
}

function HeaderContent() {
    const header = usePublicHeaderState();

    return (
        <header className={`ix-header${header.scrolled ? " ix-header-scrolled" : ""}`}>
            <HeaderTopbar />
            <div className="ix-nav-shell">
                <div className="public-container ix-nav-row">
                    <Link to="/" className="ix-logo" onClick={header.closeAll} aria-label="ISOCAL · Inicio">
                        <img src="/images/brand/isocal-logo-all-white.png" alt="ISOCAL" />
                    </Link>
                    <HeaderPrimaryNavigation
                        menuOpen={header.menuOpen}
                        servicesOpen={header.servicesOpen}
                        dropdownRef={header.dropdownRef}
                        servicesToggleRef={header.servicesToggleRef}
                        setServicesOpen={header.setServicesOpen}
                        onNavigate={header.closeAll}
                    />
                    <HeaderActions
                        menuOpen={header.menuOpen}
                        searchOpen={header.searchOpen}
                        menuToggleRef={header.menuToggleRef}
                        searchToggleRef={header.searchToggleRef}
                        setMenuOpen={header.setMenuOpen}
                        setSearchOpen={header.setSearchOpen}
                        setServicesOpen={header.setServicesOpen}
                        onNavigate={header.closeAll}
                    />
                </div>
            </div>
            <HeaderSearchPanel
                isOpen={header.searchOpen}
                searchRegionRef={header.searchRegionRef}
                onNavigate={header.closeAll}
            />
        </header>
    );
}
