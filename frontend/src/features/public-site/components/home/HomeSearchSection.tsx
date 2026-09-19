import { Link } from "react-router-dom";
import { UniversalSearchBar } from "../../../search/components/UniversalSearchBar";

export function HomeSearchSection() {
    return (
        <section className="ix-home-search-dock" aria-labelledby="home-search-title">
            <div className="public-container">
                <div className="ix-home-search-dock-inner">
                    <div className="ix-home-search-dock-copy">
                        <p className="ix-kicker">Buscador técnico</p>
                        <h2 id="home-search-title">Busca por equipo, magnitud o servicio.</h2>
                        <p>También puedes buscar por unidad, rango o marca.</p>
                    </div>
                    <div className="ix-home-search-control">
                        <UniversalSearchBar />
                        <nav aria-label="Búsquedas técnicas frecuentes" className="ix-home-search-links">
                            {[
                                ["Presión", "presión"],
                                ["Temperatura", "temperatura"],
                                ["Electricidad", "electricidad"],
                                ["Masa", "masa"],
                                ["Longitud", "longitud"],
                            ].map(([label, query]) => (
                                <Link key={query} to={`/buscar?q=${encodeURIComponent(query)}`}>{label}</Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>
        </section>
    );
}
