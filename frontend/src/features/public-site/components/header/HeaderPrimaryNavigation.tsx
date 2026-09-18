import type { Dispatch, RefObject, SetStateAction } from "react";
import { Link, NavLink } from "react-router-dom";
import { CorporateIcon } from "../../../../shared/components/ui/CorporateIcon";
import { SERVICE_LINKS } from "../ServiceNavigation.constants";

interface HeaderPrimaryNavigationProps {
    menuOpen: boolean;
    servicesOpen: boolean;
    dropdownRef: RefObject<HTMLDivElement | null>;
    servicesToggleRef: RefObject<HTMLButtonElement | null>;
    setServicesOpen: Dispatch<SetStateAction<boolean>>;
    onNavigate: () => void;
}

export function HeaderPrimaryNavigation({
    menuOpen,
    servicesOpen,
    dropdownRef,
    servicesToggleRef,
    setServicesOpen,
    onNavigate,
}: HeaderPrimaryNavigationProps) {
    return (
        <nav
            id="ix-primary-navigation"
            className={`ix-nav${menuOpen ? " ix-nav-open" : ""}`}
            aria-label="Navegación principal"
        >
            <NavLink to="/" end onClick={onNavigate}>Inicio</NavLink>
            <NavLink to="/nosotros" onClick={onNavigate}>Nosotros</NavLink>
            <div
                className={`ix-nav-services${servicesOpen ? " is-open" : ""}`}
                ref={dropdownRef}
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
                onFocusCapture={() => setServicesOpen(true)}
                onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                        setServicesOpen(false);
                    }
                }}
            >
                <div className="ix-nav-service-title">
                    <NavLink to="/servicios" onClick={onNavigate}>Servicios</NavLink>
                    <button
                        ref={servicesToggleRef}
                        type="button"
                        aria-label="Desplegar servicios"
                        aria-expanded={servicesOpen}
                        aria-controls="ix-services-menu"
                        onClick={() => setServicesOpen((value) => !value)}
                    >
                        <CorporateIcon name="chevron" />
                    </button>
                </div>
                <div id="ix-services-menu" className="ix-services-menu" aria-hidden={!servicesOpen}>
                    <div className="ix-services-menu-heading">
                        <span>Servicios ISOCAL</span>
                        <small>Explora por área técnica</small>
                    </div>
                    {SERVICE_LINKS.map((service) => (
                        <Link
                            key={service.id}
                            to={`/servicios#${service.id}`}
                            onClick={onNavigate}
                            tabIndex={servicesOpen ? undefined : -1}
                        >
                            <span>{service.number}</span>
                            <strong>{service.label}</strong>
                            <CorporateIcon name="arrow" />
                        </Link>
                    ))}
                    <Link
                        className="ix-services-menu-all"
                        to="/servicios"
                        onClick={onNavigate}
                        tabIndex={servicesOpen ? undefined : -1}
                    >
                        Ver todos los servicios <CorporateIcon name="arrow" />
                    </Link>
                </div>
            </div>
            <NavLink to="/productos" onClick={onNavigate}>Productos</NavLink>
            <NavLink className="ix-nav-tool-link" to="/herramientas" onClick={onNavigate}>Herramientas</NavLink>
            <NavLink to="/blog" onClick={onNavigate}>Blog</NavLink>
            <NavLink to="/contacto" onClick={onNavigate}>Contacto</NavLink>
        </nav>
    );
}
