import { useLocation } from "react-router-dom";
import { SERVICE_LINKS } from "./ServiceNavigation.constants";

export function ServiceNavigation() {
    const {hash} = useLocation();
    return <nav className="co-service-nav" aria-label="Áreas de servicio"><div className="public-container">
        {SERVICE_LINKS.map(s => <a key={s.id} href={`#${s.id}`} aria-current={(hash || "#metrologia") === `#${s.id}` ? "location" : undefined}><span>{s.number}</span>{s.label}</a>)}
    </div></nav>;
}
